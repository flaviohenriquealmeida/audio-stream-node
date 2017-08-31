const express = require('express');
const app = express();
const fs = require('fs');
const getStat = require('util').promisify(fs.stat);

app.use(express.static('public'));

// 10 * 1024 * 1024 // 10MB
// usamos um buffer minúsculo! O padrão é 64k
const highWaterMark =  2;

app.get('/audio', async (req, res) => {

    const filePath = './audio.ogg';
    
    const stat = await getStat(filePath);
    console.log(stat);    
    
    // informações sobre o tipo do conteúdo e o tamanho do arquivo
    res.writeHead(200, {
        'Content-Type': 'audio/mpeg',
        'Content-Length': stat.size
    });

    const stream = fs.createReadStream(filePath, { highWaterMark });

    // só exibe quando terminar de enviar tudo
    stream.on('end', () => console.log('acabou'));

    // faz streaming do audio 
    stream.pipe(res);
});

app.listen(3000, () => console.log('app is running'));