import { Router } from "express";
import { filterImageFromURL, deleteLocalFiles } from '../../util/util';

const router: Router = Router();
const validExtensions = ['.jpeg', '.gif', '.bmp', '.jpg', '.png', '.tiff']
const expression = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi;
const regex = new RegExp(expression);

// @TODO1 IMPLEMENT A RESTFUL ENDPOINT
// GET /filteredimage?image_url={{URL}}
// endpoint to filter an image from a public url.
// IT SHOULD
//    1
//    1. validate the image_url query
//    2. call filterImageFromURL(image_url) to filter the image
//    3. send the resulting file in the response
//    4. deletes any files on the server on finish of the response
// QUERY PARAMATERS
//    image_url: URL of a publicly accessible image
// RETURNS
//   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

/**************************************************************************** */

//! END @TODO1

// Root Endpoint
// Displays a simple message to the user
router.get("/", async (req, res) => {
    try {
        const { image_url } = req.query;
        if (typeof (image_url) === 'undefined' || image_url === null || image_url.length === 0) {
            res.statusCode = 400;
            res.send('query string image_url is mandatory!');
        } else {
            if (image_url.match(regex) && isValid(image_url)) {
                const filteredpath = await filterImageFromURL(image_url);
                await res.sendFile(filteredpath, () => {
                    deleteLocalFiles([filteredpath]);
                    return res.statusCode = 200;
                }, (err) => {
                    res.statusCode = 500;
                    res.statusMessage = err.message;
                });
            } else {
                res.statusCode = 422;
                res.send(`Invalid url or it is not a valid image. Valid image extensions: ${validExtensions.join(', ')} `);
            }
        }
    } catch (error) {
        res.statusCode = 500;
        res.statusMessage = error;
    }
});

const isValid = (url: string): boolean => {
    for (let i = 0; i < validExtensions.length; i++) {
        if (url.endsWith(validExtensions[i])) {
            return true;
        }
    }
    return false;
}

export const FilteredImageRouter: Router = router;