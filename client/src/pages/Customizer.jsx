import React, {useState, useEffect, useRef} from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useSnapshot } from 'valtio'
import config from '../config/config';
import state from '../store';
import {download} from '../assets'
import { rev } from '../assets';
import { headlight } from '../assets';


import { downloadCanvasToImage,reader } from '../config/helpers';
import { EditorTabs, DecalTypes, FilterTabs } from '../config/constants';
import { fadeAnimation, slideAnimation } from '../config/motion';
import { AiPicker, ColorPicker, CustomButton, FilePicker, Tab } from '../components';




const Customizer = () => {
    const snap = useSnapshot(state);
    const [file,setFile] = useState('');
    const [prompt, setPrompt] = useState('');
    const [generatingImg, setGeneratingImg] = useState(false);
    const [activeEditorTab, setActiveEditorTab] = useState("");
    const [activeFilterTab, setActiveFilterTab] = useState({
        logoCar: true,
        stylishCar: false
    });
    const audioRef = useRef(new Audio('/sound.mp3'));
    const popupRef = useRef();

    const playSound = ()=>{
        audioRef.current.currentTime = 0;
        audioRef.current.play();
    }


    const generateTabContent = ()=>{

        switch (activeEditorTab) {
            case "colorpicker":
                return <ColorPicker popupRef={popupRef} />
            case "filepicker":
                return <FilePicker
                    file={file}
                    setFile={setFile}
                    readFile={readFile}
                    popupRef={popupRef}
                />
            case "aipicker":
                return <AiPicker
                    prompt={prompt}
                    popupRef={popupRef}
                    setPrompt={setPrompt}
                    generatingImg={generatingImg}
                    handleSubmit={handleSubmit}
                />
            default:
                return null;
        }

    }

    const handleSubmit= async (type)=>{
        if(!prompt) return alert("please enter prompt");
            try{
               setGeneratingImg(true)
               const response = await fetch('https://lambo-gallardo.onrender.com/api/v1/clipdrop/',{
                method:'POST',
                headers: {
                    'Content-Type' : 'application/json'
                },
                body: JSON.stringify({
                    prompt,

                })
               })
        const data = await response.json();
        if (data && data.photo) {
            handleDecals(type, data.photo);
          } else {
            alert("Image generation failed. Please try again!");
          }
        }
        catch(error){
            alert(error)
        }
        finally{
            setGeneratingImg(false)
            setActiveEditorTab("");

        }
    }

    const handleDecals = (type,result) =>{
        const decalType = DecalTypes[type];
        state[decalType.stateProperty] = result;
        if(!activeFilterTab[decalType.filterTab]){
            handleActiveFilterTab(decalType.filterTab)
        }
    }

    const handleActiveFilterTab = (tabName) =>{
        switch (tabName) {
            case "logoCar":
                state.isLogoTexture = !activeFilterTab[tabName];
                break;
            case "stylishCar":
                    state.isFullTexture = !activeFilterTab[tabName];
                    break;
            case "headlights":
                    state.isHeadlightOn = !activeFilterTab[tabName];
                break;
            default:
                state.isLogoTexture = true;
                state.isFullTexture = false;
                state.isHeadlightOn = false;
                break;

        }
        setActiveFilterTab((prevState) => {
            return {
              ...prevState,
              [tabName]: !prevState[tabName]
            }
          })
    }

    const readFile = (type)=>{
        reader(file)
        .then((result)=>{
            handleDecals(type, result);
            setActiveEditorTab("");
        })
    }

    useEffect(()=>{
        const handleClickOutside=(e)=>{
            if(popupRef.current && !popupRef.current.contains(e.target)){
                setActiveEditorTab(null)
            }
        }
        if (activeEditorTab) {
            document.addEventListener("mousedown", handleClickOutside);
          }
          return () => {
            document.removeEventListener("mousedown", handleClickOutside);
          };
        }, [activeEditorTab]);

  return (
    <AnimatePresence>
        {!snap.intro && (
            <>
                <motion.div
                    key="custom"
                    className='absolute top-0 left-0 z-10'
                    {...slideAnimation("left")}
                >
                    <div className='flex items-center min-h-screen'>
                        <div className='editortabs-container tabs'>
                            {EditorTabs.map((tab)=>
                            (
                                <Tab
                                    key={tab.name}
                                    tab={tab}
                                    handleClick={()=> activeEditorTab!==tab.name ? setActiveEditorTab(tab.name): setActiveEditorTab(null)}
                                />
                                
                            ))}
                            {generateTabContent()}
                        </div>
                    </div>

                </motion.div>
                

                <motion.div
                    className='absolute z-10 top-5 right-5'
                    {...fadeAnimation}
                >
                    <CustomButton
                        type="filled"
                        title="Go Back"
                        handleClick={()=>state.intro = true}
                        customStyles="w-fit px-4 py-2.5 font-bold text-sm"
                    />
                    

                </motion.div>
                

                <motion.div 
                    className='filtertabs-container'
                    {...slideAnimation("up")}
                >
                    {FilterTabs.map((tab)=>
                            (
                                <Tab 
                                    key={tab.name}
                                    tab={tab}
                                    isFilterTab
                                    isActiveTab={activeFilterTab[tab.name]}
                                    handleClick={()=>{handleActiveFilterTab(tab.name)}}
                                />
                            ))}
                                        <button className='download-btn' onClick={playSound}>
              <img
                src={rev}
                alt='rev_image'
                className='w-3/5 h-3/5 object-contain'
              />
            </button>
                    <button className='download-btn' onClick={downloadCanvasToImage}>
              <img
                src={download}
                alt='download_image'
                className='w-3/5 h-3/5 object-contain'
              />
            </button>


                </motion.div>
            </>
        )}
    </AnimatePresence>
  )
}

export default Customizer