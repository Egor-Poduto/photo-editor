import React, { useState } from 'react'
import './Main.scss'
import ReactCrop from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'
import {IoIosImage } from 'react-icons/io'
const Main = () => {
    const Tool = [          //установка максимальных значений для инструментов 
        {
            name: 'brightness',
            maxValue: 200
        },
        {
            name: 'contrast',
            maxValue: 200
        },
        {
            name: 'saturation',
            maxValue: 200
        },
        {
            name: 'opacity',
            maxValue: 100
        },
        {
            name: 'blur',
            maxValue: 15
        },
        {
            name: 'invert',
            maxValue: 100
        },
        {
        name: 'sepia',
        maxValue: 200
        },
        {
            name: 'rotate',
            maxValue: 360
            },
    ]
    const [property, setProperty] = useState(
        {
            name: 'brightness',
            maxValue: 200
        }
    )
    const [details, setDetails] = useState('')
    const [crop, setCrop] = useState('')
    const [state, setState] = useState({            //установка стартовых значенй инстуменов
        image: '',
        brightness: 100,
        sepia: 0,
        saturation: 100,
        contrast: 100,
        invert: 0,
        opacity: 100,
        blur: 0,
        rotate: 0,
    })
    const inputHandle = (e) => {        //ползунок
        setState({
            ...state,
            [e.target.name]: e.target.value
        })
    }
    const imageCrop = () => {                   //обрезка изображение
        const canvas = document.createElement('canvas')
        const scaleX = details.naturalWidth / details.width
        const scaleY = details.naturalHeight / details.height
        canvas.width = crop.width
        canvas.height = crop.height
        const ctx = canvas.getContext('2d')
        ctx.drawImage(
            details,
            crop.x * scaleX,
            crop.y * scaleY,
            crop.width * scaleX,
            crop.height * scaleY,
            0,
            0,
            crop.width,
            crop.height
        )

        const base64Url = canvas.toDataURL('image/jpg')

        setState({
            ...state,
            image: base64Url
        })
    }
    const saveImage = () => {                   //сохранение изображения с примененными фильтрами
        const canvas = document.createElement('canvas')
        canvas.width = details.naturalWidth
        canvas.height = details.naturalHeight
        const ctx = canvas.getContext('2d')
        ctx.filter = `brightness(${state.brightness}%) sepia(${state.sepia}%) blur(${state.blur}px) opacity(${state.opacity}%) invert(${state.invert}%) saturate(${state.saturation}%) contrast(${state.contrast}%)`
        ctx.translate(canvas.width / 2, canvas.height / 2)
        ctx.rotate(state.rotate * Math.PI / 180)
        ctx.scale(state.vartical, state.horizental)
        ctx.drawImage(details,-canvas.width / 2,-canvas.height / 2,canvas.width,canvas.height)
        const link = document.createElement('a')
        link.download = 'image_edit.jpg'
        link.href = canvas.toDataURL()
        link.click()
    }
    const imageHandle = (e) => {                //считывание изображения для дальнейшей работы с ним 
        if (e.target.files.length !== 0) {
            const reader = new FileReader()
            reader.onload = () => {
                setState({
                    ...state,
                    brightness: 100,
                    sepia: 0,
                    saturation: 100,
                    contrast: 100,
                    invert: 0,
                    opacity: 100,
                    blur: 0,
                    rotate: 0,
                    image: reader.result
                })
            }
            reader.readAsDataURL(e.target.files[0])
        }
    }
    return (                        //отрисовка страницы
        <div className='image_editor'>
            <div className="card">
                <div className="card_header">
                    <h2>Photo editor</h2>
                </div>
                <div className="card_body">
                    <div className="sidebar">
                        <div className="side_body">
                            <div className="filter_section">
                                <span>Tools</span>
                                <div className="filter_key">
                                    {
                                        Tool.map((v, i) => <button className={property.name === v.name ? 'active' : ''} onClick={() => setProperty(v)} key={i} >{v.name}</button>)
                                    }
                                </div>
                            </div>
                            <div className="filter_slider">
                                <div className="label_bar">
                                    <label htmlFor="range">Range</label>
                                </div>
                                <input name={property.name} onChange={inputHandle} value={state[property.name]} max={property.maxValue} type="range" />
                            </div>
                        </div>
                        <div className="save">
                            <button onClick={saveImage} className='save'>Save Image</button>
                        </div>
                    </div>
                    <div className="image_section">
                        <div className="image">
                            {
                                state.image ? <ReactCrop crop={crop} onChange={c => setCrop(c)}>
                                  <img onLoad={(e) => setDetails(e.currentTarget)} style={{ filter: `brightness(${state.brightness}%) sepia(${state.sepia}%) blur(${state.blur}px) opacity(${state.opacity}%) invert(${state.invert}%) saturate(${state.saturation}%) contrast(${state.contrast}%)`, transform: `rotate(${state.rotate}deg)` }} src={state.image} alt="" />
                                </ReactCrop> :
                                    <label htmlFor="choose">
                                        <IoIosImage />
                                        <span>Choose Image</span>
                                    </label>
                            }
                        </div>
                        <div className="image_select">
                            {
                                crop && <button onClick={imageCrop} className='crop'>Crop Image</button>
                            }
                            <label htmlFor="choose">Choose image</label>
                            <input onChange={imageHandle} type="file" id='choose' />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Main
