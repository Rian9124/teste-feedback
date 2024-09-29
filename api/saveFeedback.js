import { promises as fs } from 'fs';
import path from 'path';

export default async function handler(req, res) {
  const filePath = path.resolve('./', 'feedback.json');

  if (req.method === 'POST') {
    const feedback = {
      name: req.body.name,
      comment: req.body.comment,
      date: new Date().toISOString(),
    };

    // Lê o arquivo JSON existente
    let feedbacks = [];
    try {
      const data = await fs.readFile(filePath, 'utf8');
      feedbacks = JSON.parse(data);
    } catch (err) {
      // Se o arquivo não existir, começa com um array vazio
      feedbacks = [];
    }

    // Adiciona o novo feedback
    feedbacks.push(feedback);

    // Salva o novo feedback no arquivo JSON
    await fs.writeFile(filePath, JSON.stringify(feedbacks, null, 2));

    return res.status(200).json({ message: 'Feedback salvo com sucesso!' });
  }

  // Se for uma requisição GET, retorna os feedbacks
  if (req.method === 'GET') {
    try {
      const data = await fs.readFile(filePath, 'utf8');
      return res.status(200).json(JSON.parse(data));
    } catch (err) {
      return res.status(404).json({ message: 'Nenhum feedback encontrado' });
    }
  }

  // Se for qualquer outro método HTTP
  return res.status(405).json({ message: 'Método não permitido' });
}
