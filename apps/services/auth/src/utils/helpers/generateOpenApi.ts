import { auth } from '../../auth';
import fs from 'fs';

const generateOpenApi = async () => {
  const authReference = await auth.api.generateOpenAPISchema();
  fs.writeFileSync('./openapi.json', JSON.stringify(authReference, null, 2), 'utf-8');
};

generateOpenApi();
