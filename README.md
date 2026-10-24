# Reelwork – real AI video generator

## Run it on your computer
1. Create an account at https://fal.ai, add a few dollars of credit, and create an API key.
2. In this folder run: npm install
3. Copy .env.example to .env.local and fill in FAL_KEY and ACCESS_CODE.
4. Run: npm run dev  then open http://localhost:3000
5. Type a product, enter your access code, press Generate. Wait 1 to 3 minutes.

## Put it online (Vercel)
1. Push this folder to a new GitHub repository (.env.local is ignored, good).
2. On vercel.com choose Add New > Project and import the repository.
3. In Settings > Environment Variables add FAL_KEY, FAL_MODEL and ACCESS_CODE.
4. Deploy.

## Notes
- Every video costs real money. Check the price on the model page first, and keep your ACCESS_CODE private until payments are added.
- To change model, set FAL_MODEL to another id from fal.ai. If its inputs differ, set FAL_EXTRA_INPUT or edit app/api/generate/route.js.
- If "Download video" opens the video in a new tab, right-click it (or long-press on phone) and choose Save video.
