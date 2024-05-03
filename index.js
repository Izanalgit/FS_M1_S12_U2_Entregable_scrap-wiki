const express = require ("express");
const cheerio = require ("cheerio");
const axios = require("axios");

const app = express();

const urlRoot = 'https://es.wikipedia.org'
const urlDoor = `${urlRoot}/wiki/Categor%C3%ADa:M%C3%BAsicos_de_rap`

const inerURLs=[];
const rapSingers=[];

function NewSinger(title,imgs,texts){
    this.title=title;
    this.imgs=imgs;
    this.text=texts;
}

const msgFD = (url)=>console.log(`DONE : Fetch completed : ${url}`);
const msgFE = (url)=>console.log(`ERROR : Cannot fetch : ${url}`);
const msgFL = (element,container)=>console.log(`LOADING : ${element} : ${container}`);


app.get("/",express.json(),(req,res)=>{

    axios.get(urlDoor)
    .then((resp)=>{

        msgFD(urlDoor);

        const htmlDom = resp.data;
        const $ = cheerio.load(htmlDom);


        $('#mw-pages a').each((ind,elm)=>{
            const singerURL = $(elm).attr('href');
            
            inerURLs.push(singerURL);   
        })

    })
    .then(()=>{
        inerURLs.forEach(async(url,indxUrl,urls)=>{
            msgFL(indxUrl,url);
            const inerURL =`${urlRoot}${url}`;
        
            axios.get(inerURL).then(async (resp)=>{
                
                const htmlDom = resp.data;
                const $ = cheerio.load(htmlDom);
    
                const texts = [];
                const imgs = [];
                
                const title = $('h1').text();
                msgFL("Title",title);
        
                $('p').each((ind,elm)=>{
                    const text = $(elm).text();
                    
                    texts.push(text);
                })
                msgFL("Texts",title);
    
                $('img').each((ind,elm)=>{
                    const img = $(elm).attr('src');
                    
                    imgs.push(img);
                })
                msgFL("Images",title);
    
                await rapSingers.push(new NewSinger(title,imgs,texts));
    
                msgFD(inerURL);

    
            }).catch(()=>msgFE(inerURL))

            if(indxUrl==urls.length-1){
                msgFD("ALL");
                res.json(rapSingers);  
            }
            
        })       

    })
    .catch(()=>msgFE(urlDoor))
    
})


app.listen(3000,()=>{
    console.log("Server on http://localhost:3000");
})