import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";

import styles from './styles.module.scss'

export function Modal({ children, giphyData, toggleModal }) {
    // const [isBrowser, setIsBrowser] = useState(true);
  


    
        return (
            <div 
              className={styles.div_01} 
              style={
                !toggleModal ? {
                  "opacity": "100%",
                }
                : {
                  "opacity": "70%",
                }
              }
            >
              {
                toggleModal ? (
                  <div 
                  className={styles.div_02}
                  style={
                    !toggleModal ? {
                      "display": "none"
                    } : {
                      "display": "flex"
                    }
                  }
                >
                <>
                <p>{JSON.stringify(giphyData.data.data[0].embed_url)}</p>
                <img src={giphyData.data.data[0].images.fixed_height.url} alt="123" />
                <img src={giphyData.data.data[1].images.fixed_height.url} alt="123" />
                <img src={giphyData.data.data[2].images.fixed_height.url} alt="123" />
                </>
                </div>
                )
                : null
              }



              {children}
            </div>
        );
        
  
}
