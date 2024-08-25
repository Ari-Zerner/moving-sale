# Moving Sale Website

This is a simple website for displaying items for sale, with bilingual support (English and Spanish).

## How to Add Content

1. Navigate to the `content` directory.
2. Open the `items.json` file in a text editor.
3. The file structure is as follows:
   ```json
   {
     "items": [
       {
         "name": {
           "en": "Item Name in English",
           "es": "Item Name in Spanish"
         },
         "description": {
           "en": "Item description in English",
           "es": "Item description in Spanish"
         },
         "price": 100,
         "imageDir": "item_directory_name"
       },
       // More items...
     ]
   }
   ```
4. To add a new item:
   - Copy an existing item block (everything between the curly braces `{}`)
   - Paste it at the end of the `items` array, before the closing square bracket `]`
   - Make sure to add a comma after the previous item
   - Update the item details (name, description, price, and imageDir)
5. To add images:
   - Create a new directory in the `content` folder with a name that matches the `imageDir` value
   - Place the image files in this new directory
   - Rename the image files numerically (1.jpg, 2.png, 3.gif, etc.)
   - The website will automatically display all images found in the directory
6. Save the `items.json` file after making your changes

Remember to use valid JSON syntax. If you're unsure, you can use an online JSON validator to check your file.

## Serving the Website Locally

To view the website locally, you can use Python's built-in HTTP server:

1. Open a terminal or command prompt
2. Navigate to the directory containing the website files
3. Run the following command:
   ```
   python -m http.server 8000
   ```
4. Open a web browser and go to `http://localhost:8000`

Your website should now be visible and reflect any changes you've made to the content.

## Deploying to Netlify

This website is set up to be easily deployed on Netlify. When you push changes to the main branch of the connected GitHub repository, Netlify will automatically deploy the updates.

