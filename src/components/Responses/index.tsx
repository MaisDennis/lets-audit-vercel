import { useContext, useEffect, useState } from 'react'
import { FiHeart, FiMessageSquare, FiShare2 } from 'react-icons/fi'
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai'
import { RiDeleteBin6Line } from 'react-icons/ri'
import moment from 'moment';
import 'moment/locale/pt-br'
//------------------------------------------------------------------------------
import api from '../../services/api';
import styles from './styles.module.scss'
import { SessionContext } from '../../pages/index'
import { InputComment } from '../InputComment'
//------------------------------------------------------------------------------

export function Responses({ 
  responseData,
  commentData,
  handleLikeResponse,
  handleResponseData,
  handleUnclickLikeResponse,
  handleGiphyApi,
  giphyData,
  searchword,
  setSearchword,
}) {
  
  useEffect(() => {
    handleUser()
  }, [])

  const base_url = "http://localhost:3002"

  const session: any = useContext(SessionContext)
  
  const [ firstToggle, setFirstToggle ] = useState(false);
  const [ liked, setLiked ] = useState(false);
  const [ responses, setResponses ] = useState([]);
  const [ responseCounter, setResponseCounter ] = useState(5)
  const [ toggleResponses, setToggleResponses ] = useState(false);
  const [ user, setUser ]: any = useState();

  function handleToggleResponses() {
    setToggleResponses(!toggleResponses)
  }

  async function handleDelete(n) {
    await api.delete(`/responses/${responseData.id}`, {
      params: {
        responseData,
      },
    })
    handleResponseData(n)
  }

  async function handleUser() {
    const userResult = await api.get(`/users/${responseData.id_user}`)
    userLikedThisResponse()
    setUser(userResult.data)
  }

  function userLikedThisResponse() {
    if (session) {
      responseData.like_response.map((l) => {
        if (l.id_user === session.id) {
          setLiked(true)
        }
      })
    }
  }

  function handleLikeAction() {
    if (session) {
      handleLikeResponse(responseData)
      setLiked(true)
    }
  }

  function handleUnclickLikeAction() {
    if (session) {
      handleUnclickLikeResponse(responseData)
      setLiked(false)
    }
  }

  const AutoLink = ({ text }) => {
    const delimiter = /((?:https?:\/\/)?(?:(?:[a-z0-9]?(?:[a-z0-9\-]{1,61}[a-z0-9])?\.[^\.|\s])+[a-z\.]*[a-z]+|(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3})(?::\d{1,5})*[a-z0-9.,_\/~#&=;%+?\-\\(\\)]*)/gi;
  
    return (
      <div className={styles.message}>
        {text.split(delimiter).map(word => {
          const match = word.match(delimiter);
          if (match) {
            const url = match[0];
            return (
              <a 
                key={word.index}
                href={url.startsWith('http') ? url : `http://${url}`}
                style={{'color': '#17C8EB'}}
              >
                {url}
              </a>
            );
          }
          return word;
        })}
      </div>
    );
  };
  // ---------------------------------------------------------------------------
  return (
    <div className={styles.div_01}>
      {/* <p>{JSON.stringify(user)}</p> */}
      <div className={styles.div_02_A}>
      
        <div className={styles.div_03_A}>
        {/* <img src="/images/defaultAvatar.png" alt="default_avatar" /> */}
          {
            user && user.avatar ? (
              <img src={user.avatar} alt="user_avatar" />
            ) 
            : (
              <img src="/images/defaultAvatar.png" alt="default_avatar" />
            )
          }
        </div>
        
        <div className={styles.div_03_B}>
          <div className={styles.div_04_A}>
            <div className={styles.div_05_A}>
              { 
                user ? (
                  <>
                    <p className={styles.name}>{ user ? user.name : 'No name'}</p>
                    <p className={styles.time}>
                      ... {moment(new Date(responseData.created_at)).locale('pt-br').fromNow()}
                    </p>
                  </>
                  
                )
                : (
                  <p className={styles.name}>sem nome</p>
                )
              }
              
            </div>
            <div className={styles.div_05_B}>
              {
                session && responseData.id_user === session.id ? (
                  <div className={styles.div_highlight}>
                    <button
                      type='button'
                      onClick={() => handleDelete(responseCounter)}
                    >
                      <RiDeleteBin6Line
                        size={18}
                        style={{
                          'color': 'lightslategray', 
                          // 'background': '#666'
                        }}
                      />
                    </button>
                  </div>
                )
                : null
              }
            </div>
          </div>
          <div className={styles.div_04_B}>
            {
              responseData.message ? (
                <AutoLink text={responseData.message}/>
              )
              : (
                null
              )
            }
            {
              responseData.id_image ? (
                <>
                  { 
                    responseData.image.type === 'FILE' ? (
                      <img src={`${base_url}${responseData.image.file_url}`} alt="response image"/>
                    )
                    : (
                        <img src={`${responseData.image.file_url}`} alt="response gif"/>
                    )
                  }
                </>
              )
              : (
                null
              )
            }
          </div>
      
          <div className={styles.div_04_C}>
      
            <div className={styles.div_05_C}>
              <div className={styles.div_highlight}>
                <button 
                  className={styles.buttonIcon}
                  onClick={() => handleToggleResponses()}
                >
                  <FiMessageSquare size={18}/>
                </button>
              </div>
              { 
                liked ? (
                  <div className={styles.div_highlight}>
                    <button 
                      className={styles.buttonIcon}
                      onClick={() => handleUnclickLikeAction()}
                    >
                      <AiFillHeart size={18} color={'red'}/>
                    </button>                  
                  </div>
                )
                : (
                  <div className={styles.div_highlight}>
                    <button 
                      className={styles.buttonIcon}
                      onClick={() => handleLikeAction()}
                    >
                      <AiOutlineHeart size={18}/>
                    </button>                  
                  </div>
                )
              }
              <p className={styles.textNumber}>{responseData.like_response.length}</p>
              <div className={styles.div_highlight}>
                <button className={styles.buttonIcon}><FiShare2 size={18}/></button>
              </div>
              <p className={styles.textNumber}>{responseData.shares}</p>
            </div>
          </div>
        </div>
      </div>
      {/* ------------------------------------------------------------------ */}
      <div className={styles.div_02_B}>
        { !toggleResponses 
          ? (
            null
          )
          : (
            <div className={styles.div_03_C}>
              { session
                ? (
                  <InputComment
                    parent={'Comment'}
                    parentData={commentData}
                    handleChildData={handleResponseData}
                    childCounter={responseCounter}
                    inputPlaceholder={'Escreva uma resposta'}
                    submitButtonText={'Responder'}
                    handleGiphyApi={handleGiphyApi}
                    giphyData={giphyData}
                    searchword={searchword}
                    setSearchword={setSearchword}
                  />
                )
                : (
                  <p>Logar para responder</p>
                )
              }
            </div>
          )
        }
      </div>
    </div>
    
  )
}