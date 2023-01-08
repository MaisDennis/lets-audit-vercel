import { FormEvent, useContext, useEffect, useRef, useState } from 'react'
import { AiOutlineFileGif } from 'react-icons/ai'
import { BsImage } from 'react-icons/bs'
import { HiOutlineEmojiHappy } from 'react-icons/hi'
import { MdOutlineCancel } from 'react-icons/md'
import { useRouter } from 'next/router';
import EmojiPicker from 'emoji-picker-react';
import { useDetectClickOutside } from 'react-detect-click-outside';
// -----------------------------------------------------------------------------
import styles from './styles.module.scss'
import api from '../../services/api'
import { SessionContext } from '../../pages/index'
import { Modal } from '../Modal'
// -----------------------------------------------------------------------------
export function InputComment({ 
  parent,
  parentData,
  handleChildData,
  childCounter,
  inputPlaceholder,
  submitButtonText,
  handleGiphyApi,
  giphyData,
  searchword,
  setSearchword,
}) {
  const session: any = useContext(SessionContext)

  const hiddenFileInput = useRef(null);
  
  const [ emojiPicker, setEmojiPicker ] = useState(false);
  const [ gifPicker, setGifPicker ] = useState(false);
  const [gifUrl, setGifUrl] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [message, setMessage]: any = useState();
  const [selectedGif, setSelectedGif] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [ toggleModal, setToggleModal ] = useState(false);

  useEffect(() => {
    // console.log(giphyData)
    if (selectedImage) {
      setImageUrl(URL.createObjectURL(selectedImage));
    }
    if (selectedGif) {
      setGifUrl(selectedGif.images.fixed_height.url)
      console.log(selectedGif)
    }
  }, [ selectedImage, selectedGif ]);

  const closeDropdown = () => {
    setEmojiPicker(false);
    setGifPicker(false);
  }

  const ref = useDetectClickOutside({ onTriggered: closeDropdown });

  const router = useRouter();
  // Call this function whenever you want to
  // refresh props!
  const refreshData = () => {
    router.replace(router.asPath);
  }

  const handleImagePreview = event => {
    hiddenFileInput.current.click();
  };

  const handleCancelGifPreview = event => {
    setGifUrl(null)
    setSelectedGif(null)
  }

  const handleCancelImagePreview = event => {
    setImageUrl(null)
    setSelectedImage(null)
  }

  function toggleEmojiPicker() {
    setEmojiPicker(!emojiPicker)
    setGifPicker(false)
  }

  function toggleGifPicker() {
    setEmojiPicker(false)
    setGifPicker(!gifPicker)
  }

  async function postImage({image, description}) {
    const formData = new FormData();
    formData.append("image", image)
    formData.append("description", description)
    const imageResult = await api.post(`/images/`, formData, { 
      headers: {'Content-Type': 'multipart/form-data'},
      params: {
        type: 'FILE',
        id_user: session.id,
      },
    })

    return imageResult
  }

  async function postGif(url) {
    const gifResult = await api.post(`/images/`,  {
      headers: {'Content-Type': 'multipart/form-data'},
      params: {
        type: 'URL',
        url: url,
        id_user: session.id,
      },
    })
    console.log(gifResult)

    return gifResult
  }

  function handleEmojiClick(emoji: string) {
    if (message) {
      setMessage(message + emoji)  
    } else {
      setMessage(emoji)
    }
    setEmojiPicker(!emojiPicker)
  }

  function handleGifClick(gif: string) {
    setSelectedGif(gif)
    setGifPicker(false)
  }

  // ---------------------------------------------------------------------------
  async function submitInput(event: FormEvent) {
    event.preventDefault();
    if (imageUrl) {
      const imagePostResult = await postImage({
        image: selectedImage,
        description: "testDescription",
      })
      // console.log(imagePostResult.data.id)

      if (imagePostResult && parent === 'Proposal') {
        await api.post(`/comments/`, {
          message: message,
          id_proposal: parentData.id,
          id_user: session.id,
          likes: 0,
          shares: 0,
          id_image: imagePostResult.data.id,
        })
        // refreshData()
        setMessage('')
        setImageUrl(null)
        handleChildData(childCounter)
      }
  
      if (imagePostResult && parent === 'Comment') {
        await api.post(`/responses/`, {
          message: message,
          id_comment: parentData.id,
          id_user: session.id,
          likes: 0,
          shares: 0,
          id_image: imagePostResult.data.id,
        })
        // refreshData()
        setMessage('')
        setImageUrl(null)
        handleChildData(childCounter)
      }
    }
    else if (gifUrl) {
      const gifPostResult = await postGif(gifUrl)

      if (gifPostResult && parent === 'Proposal') {
        await api.post(`/comments/`, {
          message: message,
          id_proposal: parentData.id,
          id_user: session.id,
          likes: 0,
          shares: 0,
          id_image: gifPostResult.data.id,
        })
        // refreshData()
        setMessage('')
        setGifUrl(null)
        handleChildData(childCounter)
      }
      if (gifPostResult && parent === 'Comment') {
        await api.post(`/responses/`, {
          message: message,
          id_comment: parentData.id,
          id_user: session.id,
          likes: 0,
          shares: 0,
          id_image: gifPostResult.data.id,
        })
        // refreshData()
        setMessage('')
        setGifUrl(null)
        handleChildData(childCounter)
      }
    }

    else {
      if (parent === 'Proposal') {
        await api.post(`/comments/`, {
          message: message,
          id_proposal: parentData.id,
          id_user: session.id,
          likes: 0,
          shares: 0,
        })
        // refreshData()
        setMessage('')
        handleChildData(childCounter)
      }
  
      if (parent === 'Comment') {
        await api.post(`/responses/`, {
          message: message,
          id_comment: parentData.id,
          id_user: session.id,
          likes: 0,
          shares: 0,
        })
        // refreshData()
        setMessage('')
        handleChildData(childCounter)
      }
    }
  }
  // ---------------------------------------------------------------------------
  return (
    <div className={styles.div_01}>
      {/* <Modal toggleModal={toggleModal}/> */}
      <form onSubmit={submitInput}>

        <div className={styles.div_02_A}>
          <img src={session.user.image} alt="avatar" />
        </div>

        <div className={styles.div_02_B}>
          <input
            className={styles.commentInput}
            type="text"
            placeholder={inputPlaceholder}
            value={message}
            onChange={e => setMessage(e.target.value)}
          />
          <input
            accept="image/*"
            type="file" 
            style={{ display: 'none' }}
            ref={hiddenFileInput}
            onChange={(e) => setSelectedImage(e.target.files[0])}
          />
          {
            imageUrl && selectedImage && (
              <div
                className={styles.imagePreviewDiv}
              >
                <div className={styles.imagePreviewWrapper}>
                  <img 
                    className={styles.previewImage}
                    src={imageUrl} 
                    alt={selectedImage.name}
                    />
                  <button 
                    className={styles.cancelImagePreviewButton}
                    onClick={handleCancelImagePreview}
                  >
                    <MdOutlineCancel size={36} color={'#858585'}/>
                  </button>
                </div>
              </div>
          )}
          {
            gifUrl && selectedGif && (
              <div
                className={styles.imagePreviewDiv}
              >
                <div className={styles.imagePreviewWrapper}>
                  <img src={gifUrl} alt={selectedGif.title}/>
                  <button
                    className={styles.cancelImagePreviewButton}
                    onClick={handleCancelGifPreview}
                  >
                    <MdOutlineCancel size={48} color={'#fff'}/>
                  </button>
                </div>
              </div>
            )
          }
          <div 
            className={styles.div_03}  
            ref={ref}
          >
            <div className={styles.div_04_A}>
        
              <div 
                className={styles.div_05_A}
              >
                <button
                  type="button"
                  onClick={handleImagePreview}
                >
                  <BsImage size={20}/>
                </button>
                <button
                  type="button"
                  onClick={() => toggleGifPicker()}
                >
                  <AiOutlineFileGif size={20}/>
                </button>
                <button
                  type="button"
                  onClick={() => toggleEmojiPicker()}
                >
                  <HiOutlineEmojiHappy size={20}/>
                </button>
              </div>
              
              <div className={styles.div_05_B}>
                {
                  message || imageUrl || gifUrl ? (
                    <button 
                      type="submit"
                    >
                      {submitButtonText}
                    </button>
                  )
                  : (
                    <button 
                    type="button"
                    disabled
                  >
                    {submitButtonText}
                  </button>
                  )
                }
              </div>
            </div>
            {/*  ----------------------------------------------------------- */}
            <div 
              className={styles.div_04_B}              
            >
              {
                emojiPicker ? (
                  <div className={styles.emoji_picker_wrapper}>
                    <EmojiPicker 
                      onEmojiClick={(e) => handleEmojiClick(e.emoji)}
                      width={'auto'}
                      // skinTonePickerLocation='SEARCH'
                    />
                  </div>
                )
                : (
                  null
                )
              }                  
              {
                gifPicker ? (
                  <div className={styles.gif_picker_wrapper}>
                    <input
                        className={styles.gif_picker_input}
                        type="text"
                        placeholder='Procurar gif'
                        value={searchword}
                        onChange={e => setSearchword(e.target.value)}
                      />
                    <ul>
                      
                      {
                        giphyData.data.data.map(g => (
                          <li 
                            key={g.id}
                            onClick={() => handleGifClick(g)}
                          >
                            <img src={g.images.fixed_height.url} alt="gif preview" />
                          </li>
                        ))
                      }
                    </ul>
                  </div>      
                )
                : (
                  null
                )
              }
            </div>
          </div>

        </div>
      </form>
    </div>
  )
}