const express = require('express');
const axios = require('axios');
const ejs = require('ejs');
const path = require('path');

const app = express();
const PORT = 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/:count/news/for/:category', async (req, res) => {
    const count = parseInt(req.params.count);
    const category = req.params.category;

    if (isNaN(count) || count <= 0) {
        return res.status(400).send('Count must be a positive integer');
    }

    const validCategories = ['business', 'economic', 'finances', 'politics'];
    if (!validCategories.includes(category)) {
        return res.status(400).send('Invalid category');
    }

    const rssUrl = `https://www.vedomosti.ru/rss/rubric/${category}`;
    const jsonUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`;

    try {
        const response = await axios.get(jsonUrl);
        const articles = response.data.items.slice(0, count);

        res.render('news', { articles, category: category.charAt(0).toUpperCase() + category.slice(1), count });
    } catch (error) {
        console.error(error);
        res.status(500).send('Ошибка при получении новостей.');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

app.use(express.static('public'));