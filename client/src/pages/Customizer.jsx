import React, {useState, useEffect, useRef} from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useSnapshot } from 'valtio'
import state from '../store';
import {download} from '../assets'
import { rev } from '../assets';
import gsap from "gsap"
import * as THREE from "three";
import { downloadCanvasToImage,reader } from '../config/helpers';
import { EditorTabs, DecalTypes, FilterTabs, DesignTabs } from '../config/constants';
import { fadeAnimation, slideAnimation } from '../config/motion';
import { AiPicker, ColorPicker, CustomButton, FilePicker, Tab } from '../components';
import { TextInput } from '../components/TextInput';
import Gallery from '../components/Gallery';
import cameraRef from '../canvas/CameraRef';



const Customizer = () => {
    const snap = useSnapshot(state);
    const [file,setFile] = useState('');
    const [prompt, setPrompt] = useState('');
    const [generatingImg, setGeneratingImg] = useState(false);
    const [activeEditorTab, setActiveEditorTab] = useState("");
    const [activeDesignTab, setActiveDesignTab] = useState("");
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
    const moveCameraTo = (pos, lookAt) => {
        console.log(cameraRef)
    if (!cameraRef.current) return
    gsap.to(cameraRef.current.position, {
      ...pos,
      duration: 2,
      
      ease: 'power2.inOut',
      onUpdate: () => {
        cameraRef.current.lookAt(lookAt)
      }
    })
  }


    const generateTabContent = ()=>{
        switch (activeEditorTab) {
            case "colorpicker":
                return <ColorPicker  activeDesignTab={activeDesignTab} activeEditorTab={activeEditorTab} popupRef={popupRef} />
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

    // New function to generate design tab content
    const generateDesignTabContent = () => {
        switch (activeDesignTab) {
            case "Rims":
                return <ColorPicker activeDesignTab={activeDesignTab} activeEditorTab={activeEditorTab} colorKey="rimColor" popupRef={popupRef} />
            case "Door":
                return <ColorPicker  activeDesignTab={activeDesignTab} activeEditorTab={activeEditorTab} colorKey="doorColor" popupRef={popupRef} />
            case "Explode":
                // You might want to add specific content for Explode tab
                return null;
            case "Text":
                return <TextInput popupRef={popupRef} />
            default:
                return null;
        }
    }

    const handleSubmit= async (type)=>{
        if(!prompt) return alert("please enter prompt");
            try{
               setGeneratingImg(true)
               const response = await fetch('http://localhost:8080/api/v1/clipdrop/',{
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

    // Modified this function to handle state changes correctly
    const handleActiveDesignTab = (tabName) => {
        // Update the global state to track which tab is active
        state.activeDesignTab = tabName;
        
        switch (tabName) {
            case "Rims":
                moveCameraTo({ x: 60, y: 10, z: 10 }, new THREE.Vector3(0, 5, 0))
                break;
            case "Door":
                moveCameraTo({ x: -30, y: 20, z: -50 }, new THREE.Vector3(0, 5, 0))
                break;
            case "Explode":
                state.exploded = !state.exploded;
                
                break;
            case "Text":
                console.log(cameraRef)
                if (!state.text) {
                    state.text = "BEAST";
                }
                moveCameraTo({ x: -30, y: 20, z: -50 }, new THREE.Vector3(0, 5, 0))
            // For Rims and Door tabs, we'll just toggle the activeDesignTab state
            // The actual color picker will be rendered by generateDesignTabContent
        }
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
                setActiveEditorTab("")
                setActiveDesignTab("")
            }
        }
        if (activeEditorTab || activeDesignTab) {
            document.addEventListener("mousedown", handleClickOutside);
          }
          return () => {
            document.removeEventListener("mousedown", handleClickOutside);
          };
        }, [activeEditorTab,activeDesignTab]);

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
                key="custom2"
                className='absolute top-0 left-0 z-10'
                {...slideAnimation("left")}>
                <Gallery handleDecals={handleDecals}/>
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

            {/*my design tabs*/}
            <motion.div
                className='absolute right-0 top-0 z-5'
                {...slideAnimation("right")}

            >
                <div className='flex items-center min-h-screen'>
                    <div className='editortabs-container tabs'>
                         {DesignTabs.map((tab)=>(
                        <Tab
                            key={tab.name}
                            tab={tab}
                            handleClick={() => {
                                // Toggle tab state
                                if (activeDesignTab !== tab.name) {
                                    setActiveDesignTab(tab.name);
                                    handleActiveDesignTab(tab.name);
                                } else {
                                    setActiveDesignTab("");
                                }
                            }}
                        />
                    ))}
                    {generateDesignTabContent()}
                    </div>
                </div>
                
            </motion.div>
            </>
        )}
    </AnimatePresence>
  )
}

export default Customizer