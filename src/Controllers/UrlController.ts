import { Request, Response } from 'express';
import { container } from 'tsyringe';
import ShortenUrlService from '@src/Services/ShortenUrlService';
import RedirectUrlService from '@src/Services/RedirectUrlService';
import FindTopUrlService from '@src/Services/FindTopUrlService';
import DeleteUrlService from '@src/Services/DeleteUrlService';
import AppError from '@src/Errors/AppError';
import FindUserUrlsService from '@src/Services/FindUserUrlsService';

interface IRequest {
  url: string;
  id: string;
}

export default class UrlController {
  public async shorten(
    request: Request,
    response: Response
  ): Promise<Response> {
    const { url } = request.body as IRequest;

    const userId = request.user?.id;

    const shortenUrlService = container.resolve(ShortenUrlService);

    const shortenedUrl = await shortenUrlService.execute(url, userId);

    return response.json({ mensagem: shortenedUrl });
  }

  public async redirect(request: Request, response: Response): Promise<void> {
    const { url } = request.params;

    const redirectUrlService = container.resolve(RedirectUrlService);

    const shortenedUrl = await redirectUrlService.execute(url);

    response.redirect(shortenedUrl);
  }

  public async listTop100(
    request: Request,
    response: Response
  ): Promise<Response> {
    const findTopUrlService = container.resolve(FindTopUrlService);

    const topUrls = await findTopUrlService.execute();

    return response.json(topUrls);
  }

  public async listUserUrls(
    request: Request,
    response: Response
  ): Promise<Response> {
    const userId = request.user.id;
    const findUserUrlsService = container.resolve(FindUserUrlsService);

    if (!userId) {
      throw new AppError('Usuário não encontrado');
    }

    const topUrls = await findUserUrlsService.execute(userId);

    return response.json(topUrls);
  }

  public async delete(request: Request, response: Response): Promise<Response> {
    const { id } = request.body as IRequest;
    const userId = request.user.id;
    const urlId = parseInt(id, 10);

    if (!userId) {
      throw new AppError('Usuário não encontrado');
    }

    const deleteUrlService = container.resolve(DeleteUrlService);

    await deleteUrlService.execute(urlId, userId);

    return response.json({ response: 'URL excluida' });
  }
}
