import { useContext, useEffect, useState } from 'react'
import { FiHeart, FiMessageSquare, FiShare2 } from 'react-icons/fi'
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai'
import { RiDeleteBin6Line } from 'react-icons/ri'

import moment from 'moment';
import 'moment/locale/pt-br';
//------------------------------------------------------------------------------
import api from '../../services/api';
import styles from './styles.module.scss'
import { SessionContext } from '../../pages/index'
import { InputComment } from '../InputComment'
import { Responses } from '../Responses'
//------------------------------------------------------------------------------

export function Comments({ 
  commentData,
  handleLikeComment,
  
  handleCommentData,
  commentCounter,
  handleGiphyApi,
  giphyData,
  handleUnclickLikeComment,
  searchword,
  setSearchword,
}) {

  useEffect(() => {
    handleUser()
    handleResponseDataTotal()
  }, [])

  // const base_url = "http://localhost:3002"
  const base_url = "https://nodejs.vamosauditaropresidente.com"

  const session:any = useContext(SessionContext)
  
  const [ firstToggle, setFirstToggle ] = useState(false);
  const [ image, setImage ] = useState();
  const [ liked, setLiked ] = useState(false);
  const [ responses, setResponses ] = useState([]);
  const [ responsesTotal, setResponsesTotal ] = useState([]);
  const [ responseCounter, setResponseCounter ] = useState(5)
  const [ toggleResponses, setToggleResponses ] = useState(false);
  const [ user, setUser ]: any = useState();

  function handleToggleResponses() {
    setFirstToggle(true)
    setToggleResponses(!toggleResponses)

    if (!firstToggle) {
      handleResponseData(responseCounter)
    }
  }

  function userLikedThisComment() {
    if (session) {
      commentData.like_comment.map((l) => {
        if (l.id_user === session.id) {
          setLiked(true)
        }
      })
    }
  }

  function handleLikeAction() {
    if (session) {
      handleLikeComment(commentData)
      setLiked(true)
    }
  }

  function handleUnclickLikeAction() {
    if (session) {
      handleUnclickLikeComment(commentData)
      setLiked(false)
    }
  }

  function handleIncrementResponseCounter() {
    const i = responseCounter + 5
    setResponseCounter(i)
    handleResponseData(i)

  }

  async function handleDelete(n) {
    await api.delete(`/comments/${commentData.id}`, {
      params: {
        commentData,
      },
    })
    handleCommentData(n)
  }

  async function handleResponseData(n) {
    const { data } = await api.get(`/responses/${commentData.id}`, {
      params: { take: n},
    })
    setResponses(data)
    handleResponseDataTotal()
  }

  async function handleResponseDataTotal() {
    const { data } = await api.get(`/responses/total/${commentData.id}`)
    setResponsesTotal(data)
  }

  async function handleLikeResponse(data) {
    if (session) {
      const likeResult = await api.put(`/users/connectToResponses/${session.id}`, {
        id_response: data.id
      })
      handleResponseData(responseCounter)   
    }
  }

  async function handleUnclickLikeResponse(data) {
    if (session) {
      const unclickLikeResult = await api.delete(`/users/disconnectToResponses/${session.id}`, {
        params: {
          id_response: data.id,
        },
      })
      handleResponseData(responseCounter)   
    }
  }

  async function handleUser() {
    const userResult = await api.get(`/users/${commentData.id_user}`)
    userLikedThisComment()
    setUser(userResult.data)
  }

  function AutoLink({ text }) {
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
                className={styles.message}
                // className={styles.message}
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

      <div className={styles.div_02_A}>
      
        <div className={styles.div_03_A}>
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
                      ... {moment(new Date(commentData.created_at)).locale('pt-br').fromNow()}
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
                session && commentData.id_user === session.id && commentData.response[0] === undefined ? (
                  <div className={styles.div_highlight}>
                    <button
                      type='button'
                      onClick={() => handleDelete(commentCounter)}
                    >
                      <RiDeleteBin6Line
                        size={18}
                        style={{
                          'color': 'lightslategray',
                        }}
                      />
                    </button>
                  </div>
                )
                : (
                  null
                )
              }
            </div>
          </div>
          <div className={styles.div_04_B}>
            {
              commentData.message ? (
                <AutoLink text={commentData.message}/>
              )
              : null
            }
            {
              commentData.id_image ? (
                <>
                  { 
                    commentData.image.type === 'FILE' ? (
                      <img src={`${base_url}${commentData.image.file_url}`} alt="comment image"/>
                    )
                    : (
                        <img src={`${commentData.image.file_url}`} alt="comment gif"/>
                    )
                  }
                </>
              )
              : null
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
              
              <p className={styles.textNumber}>{responsesTotal.length}</p>
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
              <p className={styles.textNumber}>{commentData.like_comment.length}</p>
              <div className={styles.div_highlight}>
                <button className={styles.buttonIcon}>
                  <FiShare2 size={18}/>
                </button>
              </div>
              
              <p className={styles.textNumber}>{commentData.shares}</p>
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
                  <p className={styles.logToText}>Logar para responder 🙂</p>
                )
              }
              { responses[0]
                ? (
                  <>
                    <p className={styles.commentTitle}>Respostas:</p>
                    <div className={styles.div_04_D}>
                      { responses.map(r => (
                        <Responses
                          key={r.id}
                          responseData={r}
                          commentData={commentData}
                          handleLikeResponse={handleLikeResponse}
                          handleResponseData={handleResponseData}
                          handleUnclickLikeResponse={handleUnclickLikeResponse}
                          handleGiphyApi={handleGiphyApi}
                          giphyData={giphyData}
                          searchword={searchword}
                          setSearchword={setSearchword}
                        />
                      ))}
                      {
                        responseCounter > responses.length
                          ? (null)
                          : (
                            <div className={styles.div_highlight}>
                            <button
                              className={styles.show_more_button}
                              onClick={() => handleIncrementResponseCounter()}
                            >
                              Mostre mais respostas
                            </button>
                            </div>

                          )
                      }
                    </div>
                  </>
                )
                : (
                    null  
                )
              }
            </div>
          )
        }
      </div>
    </div>
  )
}