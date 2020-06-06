import { Router, Request, Response } from 'express';
import { FilteredImageRouter } from './filteredimage/filteredimage.router';

const router: Router = Router();

router.use('/filteredimage', FilteredImageRouter);

router.get('/', async (req: Request, res: Response) => {
    res.send(`Available endpoints: GET /filteredimage?image_url={image url}`);
});

export const IndexRouter: Router = router;  