# Usando uma imagem base com Python
FROM python:3.12.9

# Instalar dependências do sistema
RUN apt-get update && apt-get install -y \
    curl \
    libpq-dev \
    libglib2.0-0 \
    libsm6 \
    libxext6 \
    libxrender1 \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Instalar Ollama
RUN curl -fsSL https://ollama.com/install.sh | sh

# Definir diretório de trabalho
WORKDIR /app

# Criar ambiente virtual e instalar dependências do Python
RUN python -m venv /app/venv
RUN pip install --upgrade pip
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copiar arquivos do projeto
COPY . /app

# Iniciar Ollama em segundo plano e aguardar antes de baixar modelos
RUN ollama serve & sleep 5 && ollama pull mistral && ollama pull nomic-embed-text

# Expor a porta do FastAPI
EXPOSE 8000

# Iniciar o Ollama e o FastAPI ao rodar o container
CMD ["sh", "-c", "ollama serve & uvicorn main:app --host 0.0.0.0 --port 8000"]
