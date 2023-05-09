import React, { useState } from "react"
import * as htmlToImage from 'html-to-image'
import { toPng, toJpeg, toBlob, toPixelData, toSvg } from 'html-to-image'

export default function Meme(){
    const [meme, saveMeme] = useState({
        topText: "",
        bottomText: "",
        imageurl: ""
    })
    const[disable, setDisable] = useState(true)

    const [memeImg, importMeme] = useState([])

    const [file, setFile] = useState();

    React.useEffect(() => {
        async function getMemes() {
            const res = await fetch("https://api.imgflip.com/get_memes")
            const data = await res.json()
            importMeme(data.data.memes)
        }
        getMemes()
    }, [])

    function getMemeImage(){
        const memesArray = memeImg
        const randomNumber = Math.floor(Math.random() * memesArray.length)
        const url = memesArray[randomNumber].url
        saveMeme(prevMeme => ({
            ...prevMeme,
            imageurl: url,
            topText: "",
            bottomText: ""
        }))
        setDisable(false)
        setFile(0)
    }
    function handleChange(event){
        saveMeme(prevMeme => {
            const {name, value} = event.target
            return {
                ...prevMeme,
                [name]: value
            }
        })
    }
    function screenShot(){
        htmlToImage.toPng(document.querySelector(".img"))
        .then(function (dataUrl) {
            const link = document.createElement("a");
            link.download = `${meme.topText}.png`;
            link.href = dataUrl;
            link.click();
        });
    }
    
    function handleChoose(event){
        setFile(URL.createObjectURL(event.target.files[0]))
        console.log(event.target.files)
        saveMeme(prevMeme => ({
            ...prevMeme,
            topText: "",
            bottomText: ""
        }))
        setDisable(false)
    }
    
    return(
        <menu>
            <div className="form">
                <div className="input-joke">
                    <input name="topText" value={meme.topText} className="top-text" type="text" placeholder="Top Text" onChange={handleChange} disabled={disable}/>
                    <input name="bottomText" value={meme.bottomText} className="bottom-text" type="text" placeholder="Bottom Text" onChange={handleChange} disabled={disable}/>
                </div>
                <div className="button-joke">
                    <button className="button" onClick={getMemeImage}>Get a new meme image  🖼</button>
                    <div className="action">
                        <button onClick={screenShot}>Download</button>
                        <label htmlFor="file">Choose image...</label>
                        <input type="file" onChange={handleChoose} name="imageurl" id="file"></input>
                    </div>
                    
                </div>
            </div>
            <div className="img">
                <p className="top">{meme.topText}</p>
                <p className="bottom">{meme.bottomText}</p>
                {file === 0 ? <img id="image" src={meme.imageurl} className="meme-image"></img> 
                : <img id="image" src={file} className="meme-image"></img>}
            </div>
        </menu>
        
    )
}