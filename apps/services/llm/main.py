import os
import psycopg2
from fastapi import FastAPI, UploadFile, File, HTTPException
from pydantic import BaseModel
from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams, PointStruct
from langchain_ollama import OllamaEmbeddings, OllamaLLM
from uuid import uuid4
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"], 
    allow_headers=["*"],
)

# Modelo de linguagem e embeddings
model = OllamaLLM(model="mistral")
embedding_model = OllamaEmbeddings(model="nomic-embed-text")

qdrant = QdrantClient(
    host=os.getenv("QDRANT_HOST", "host.docker.internal"),
    port=int(os.getenv("QDRANT_PORT", "6333"))
)

COLLECTION_NAME = "documents"

# Criar collection se não existir
if not qdrant.collection_exists(collection_name=COLLECTION_NAME):
    qdrant.recreate_collection(
        collection_name=COLLECTION_NAME,
        vectors_config=VectorParams(size=768, distance=Distance.COSINE)
    )

DB_NAME = os.getenv("DB_NAME", "logdb")
DB_USER = os.getenv("DB_USER", "postgres")
DB_PASSWORD = os.getenv("DB_PASSWORD", "postgres")
DB_HOST = os.getenv("DB_HOST", "host.docker.internal")
DB_PORT = os.getenv("DB_PORT", "5432")

# --- Models ---
class ChatMessage(BaseModel):
    name: str
    age: int
    gender: str
    message: str

def save_message_to_db(chat_id: str, message_type: str, message: str):
    conn = psycopg2.connect(
        dbname="logdb",  
        user="postgres",
        password="postgres", 
        host="host.docker.internal", 
        port="5432"
    )
    cur = conn.cursor()

    cur.execute("""
    CREATE TABLE IF NOT EXISTS history_logs (
        id SERIAL PRIMARY KEY,
        chat_id VARCHAR(255) NOT NULL,
        type VARCHAR(50) NOT NULL,
        message TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """)
    cur.execute("""
        INSERT INTO history_logs (chat_id, type, message)
        VALUES (%s, %s, %s)
    """, (chat_id, message_type, message))

    conn.commit()
    cur.close()
    conn.close()


# Upload de arquivos .txt para o Qdrant
@app.post("/upload_txt/")
async def upload_txt(file: UploadFile = File(...)):

    if not file.filename.endswith(".txt"):
        raise HTTPException(status_code=400, detail="Apenas arquivos .txt são permitidos.")

    content = await file.read()
    text = content.decode("utf-8")
    file_id = str(uuid4())

    # Gerar embedding
    embedding = embedding_model.embed_query(text)

    # Salvar no Qdrant
    qdrant.upsert(
        collection_name=COLLECTION_NAME,
        points=[
            PointStruct(
                id=file_id,
                vector=embedding,
                payload={"text": text}
            )
        ]
    )

    return {"message": f"Arquivo '{file.filename}' salvo com sucesso no banco vetorial."}

# Buscar documentos relevantes no Qdrant
def search_documents(query):
    query_embedding = embedding_model.embed_query(query)

    search_result = qdrant.search(
        collection_name=COLLECTION_NAME,
        query_vector=query_embedding,
        limit=3
    )

    documents = [hit.payload["text"] for hit in search_result]
    return documents

# Invocar o modelo utilizando contexto relevante
def ask_model(descricao: ChatMessage):
    relevant_texts = search_documents(descricao.message)

    if relevant_texts:
        context = "\n".join(relevant_texts)
        prompt = f"Use as informações abaixo para responder a pergunta:\n\n{context}\n\nPergunta: {descricao.message}"
    else:
        prompt = descricao.message

    result = model.invoke(input=prompt)
    return result


@app.post("/chat/{chat_id}")
def chat(chat_id: str, chat_message: ChatMessage):
    print('chat_id:', chat_id)
    # Salva a mensagem do usuário
    save_message_to_db(chat_id, "user", chat_message.message)

    # Chama o modelo para gerar a resposta
    answer_model = ask_model(chat_message)

    # Salva a resposta do modelo
    save_message_to_db(chat_id, "model", answer_model)

    # Recupera o histórico de mensagens
    conn = psycopg2.connect(
        dbname="logdb",  
        user="postgres",
        password="postgres", 
        host="host.docker.internal", 
        port="5432"
    )
    cur = conn.cursor()

    cur.execute("""
        SELECT chat_id, type, message, created_at
        FROM history_logs
        WHERE chat_id = %s
        ORDER BY created_at ASC
    """, (chat_id,))
    chat_history = cur.fetchall()
    cur.close()
    conn.close()

    logs = [{"type": row[1], "message": row[2], "created_at": row[3]} for row in chat_history]

    return {"logs": logs}

@app.get("/chat/{chat_id}/logs")
def chat_logs(chat_id: str):
    conn = psycopg2.connect(
        dbname="logdb",  
        user="postgres",
        password="postgres", 
        host="host.docker.internal", 
        port="5432"
    )
    cur = conn.cursor()

    cur.execute("""
        SELECT chat_id, type, message, created_at
        FROM history_logs
        WHERE chat_id = %s
        ORDER BY created_at ASC
    """, (chat_id,))
    chat_history = cur.fetchall()
    cur.close()
    conn.close()

    logs = [{"type": row[1], "message": row[2], "created_at": row[3]} for row in chat_history]

    return {"logs": logs}