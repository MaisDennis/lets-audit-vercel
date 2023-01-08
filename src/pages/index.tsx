import { GetServerSideProps, GetStaticProps } from 'next';
import { getSession, signIn, useSession } from 'next-auth/react'
import { createContext, FormEvent, useEffect, useState } from 'react'
// -----------------------------------------------------------------------------
import styles from '../styles/Home.module.scss'
import { Header } from '../components/Header'
import { Proposal } from '../components/Proposals'
import { ProposalByCreatedAt } from '../components/ProposalsByCreatedAt'
// import Modal from 'react-modal';
import api from '../services/api'
import giphyApi from '../services/giphyApi'

// export const getStaticProps: GetStaticProps = async () => {
//   const { data } = await api.get(`proposals/`)
//   // const proposalsData = data
//   // console.log(proposalsObject)
  
//   return  {
//     props: {
//       proposalsData: data,
//       revalidate: 60 * 60 * 1, // 1 hours
//     }   
//   }
// }

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const proposalsResult = await api.get(`proposals/`)
  
  const session = await getSession({ req });
  let sessionData: Object

  if (session) {
    let sessionAPIResult = await api.get(`users/email/${session.user.email}`)
    // console.log('sessionAPIResult', sessionAPIResult.data, session)
    if (sessionAPIResult.data) {
      sessionData = {id: sessionAPIResult.data.id, ...session}
    } else {
      const sessionAPIPostResult = await api.post(`users/`, {
        avatar: session.user.image,
        email: session.user.email,
        name: session.user.name,
      })
      // console.log('sessionAPIPostResult', sessionAPIPostResult)
      sessionData = {id: sessionAPIPostResult.data.id, ...session}
    }
  }
  // console.log('getServerSide', session)

  return {
    props: {
      proposalsData: proposalsResult.data,
      sessionData: sessionData ? sessionData : null,
      giphyApiKey: process.env.GIPHY_API_KEY,
    }
  }
}
// -----------------------------------------------------------------------------
export const SessionContext = createContext('')
// Modal.setAppElement("#__next");
// -----------------------------------------------------------------------------
export default function Home({ 
  proposalsData, 
  sessionData,
  giphyApiKey,
}) {

  function handleSignInGoogle() {
    signIn('google');
  }

  function handleSignInFacebook() {
      signIn('facebook');
  }
  
  const [ inputLogOnMessage, setInputLogOnMessage ]: any = useState();
  const [ proposalMessage, setProposalMessage ]: any = useState();
  const [ proposals, setProposals ] = useState(proposalsData);
  const [ proposalsByCreatedAt, setProposalsByCreatedAt ] = useState([]);
  const [ giphyData, setGiphyData ] = useState();
  const [ toggleModal, setToggleModal ] = useState(false);
  const [ searchword, setSearchword ] = useState();
  
  useEffect(() => {
    handleProposalsByCreatedAt()
    handleGiphyApi()
  }, [ searchword ])

  async function submitProposalMessage(event: FormEvent) {
    event.preventDefault();
    const includeProposalResult = await api.post(`proposals/`, {
      message: proposalMessage,
      id_user: sessionData.id,
    })
    setProposalMessage('')
    const newProposalsResult = await api.get(`/proposals/`)
    setProposals(newProposalsResult.data)
  }

  async function handleDeleteProposal(proposalData) {
    const proposalResult = await api.delete(`proposals/${proposalData.id}`)
    const newProposalsResult = await api.get(`/proposals/`)
    setProposals(newProposalsResult.data)
  }

  async function handleGiphyApi() {
    let giphyApiResults

    if (searchword) {
      giphyApiResults = await giphyApi.get(`/search`, {
        params: {
          q: searchword,
          api_key: giphyApiKey,
          limit: '15',
          rating: 'g',
        }
      })      
    } 
    else {
      giphyApiResults = await giphyApi.get(`/trending`, {
        params: {
          api_key: giphyApiKey,
          limit: '9',
          rating: 'g',
        }
      })
    }

    setGiphyData(giphyApiResults)
    // console.log(giphyApiResults.data.data)
  }

  async function handleRelevance(proposalData) {
    await api.put(`/users/relevanceToProposals/${sessionData.id}`, {
      id_proposal: proposalData.id,
    })
    // const newProposalsResult = await api.get(`/proposals/`)
    // setProposals(newProposalsResult.data)
  }

  async function handleProposalsByCreatedAt() {
    const proposalsResult = await api.get(`/proposals/by_created_at`)
    setProposalsByCreatedAt(proposalsResult.data)
    // console.log(proposalsResult.data)
  }

  async function handleToggleModal() {
    if (!giphyData) {
      await handleGiphyApi()
    }
    setToggleModal(!toggleModal)
  }

  async function handleUpvote(proposalData) {
    await api.put(`/users/upvoteToProposals/${sessionData.id}`, {
      id_proposal: proposalData.id,
    })
    const newProposalsResult = await api.get(`/proposals/`)
    setProposals(newProposalsResult.data)
  }

  async function handleUnClickUpvote(proposalData) {
    await api.delete(`/users/upvoteToProposals/${sessionData.id}`, {
      params: {
        id_proposal: proposalData.id,
      }
    })
    const newProposalsResult = await api.get(`/proposals/`)
    setProposals(newProposalsResult.data)
  }

  async function handleDownvote(proposalData) {
    await api.put(`/users/testToProposals/${sessionData.id}`, {
      id_proposal: proposalData.id,
    })
    const newProposalsResult = await api.get(`/proposals/`)
    setProposals(newProposalsResult.data)
  }

  async function handleUnClickDownvote(proposalData) {
    await api.delete(`/users/testToProposals/${sessionData.id}`, {
      params: {
        id_proposal: proposalData.id,
      }
    })
    const newProposalsResult = await api.get(`/proposals/`)
    setProposals(newProposalsResult.data)
  }

  let subtitle;
  const [modalIsOpen, setIsOpen] = useState(true);

  function openModal() {
    setIsOpen(true);
  }

  function afterOpenModal() {
    // references are now sync'd and can be accessed.
    subtitle.style.color = '#f00';
  }

  function closeModal() {
    setIsOpen(false);
  }

  const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
    },
  };
  // ---------------------------------------------------------------------------
  return (  
    <SessionContext.Provider value={sessionData}>
      <Header
        handleSignInFacebook={handleSignInFacebook}
        handleSignInGoogle={handleSignInGoogle}
      />
      
      <div className={styles.div_01_A}>
      
        <div className={styles.div_02_A}>
          
          <div className={styles.div_03_A}>
            <img className={styles.flagIcon} src="/images/eyeGif.gif" alt="Brazilian Flag" />
            
            <h1 className={styles.title}>Vamos Auditar o Presidente</h1>

          </div>
          <p className={styles.description}>
            As eleições vêm e as eleições vão e ninguém lembra mais o que foi falado nos debates. 
            Não dessa vez!
            Os presidentes daqui para frente não vão ter mais moleza.
            Vamos cobrar o que foi falado e prometido...
            Vamos Auditar o Presidente!
          </p>          
        </div>
      </div>

        {/* ---------------------------------------------------------------- */}
      <div className={styles.div_01_B}>

        <div className={styles.div_video_links}>
          <div className={styles.div_04}>
            <p className={styles.subtitle}>Assista ao debate na Band 2022 (1º turno):</p>
            {/* <img src="/images/test.jpg" alt="test" /> */}
            <iframe src="https://www.youtube.com/embed/WwdgWl_nmKI" title="YouTube video player"  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" ></iframe>
            <p className={styles.subtitle}>Assista ao debate na Band 2022 (2º turno):</p>
            {/* <img src="/images/test.jpg" alt="test" /> */}
            <iframe src="https://www.youtube.com/embed/iYVk1CeIs60" title="YouTube video player"  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"></iframe>
          </div>
          <div className={styles.div_04}>
            <p className={styles.subtitle}>Assista ao debate na Cultura 2022 (1º turno):</p>              
            {/* <img src="/images/test.jpg" alt="test" /> */}
            <iframe width="560" height="315" src="https://www.youtube.com/embed/yeSMJukpunY" title="YouTube video player"  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"></iframe>
            <p className={styles.subtitle}>Assista ao debate na Cultura 2022 (2º turno):</p>
            {/* <img src="/images/test.jpg" alt="test" /> */}
            <iframe src="https://www.youtube.com/embed/jSlG0No9muY" title="YouTube video player"  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"></iframe>
          </div>
        </div>

        <div className={styles.div_02_B}>
          <form onSubmit={submitProposalMessage}>
            <div className={styles.div_03_C}>
              { 
                sessionData ? (
                  <textarea
                    className={styles.proposalTextarea}
                    // type="text"
                    rows={2}
                    placeholder='Incluir uma proposta falada para ser monitorada?'
                    value={proposalMessage}
                    onChange={e => setProposalMessage(e.target.value)}
                  />
                )
                : (
                  <textarea
                    className={styles.proposalTextareaNotLogged}
                    // type="text"
                    rows={2}
                    placeholder='Incluir uma proposta falada para ser monitorada?'
                    value={inputLogOnMessage}
                    // onChange={e => setInputLogOnMessage('OK')}
                    onFocus={e => setInputLogOnMessage('Logar para incluir uma proposta 🙂')}
                  />
                )
              }
            </div>

            <div className={styles.div_03_D}>
              {
                sessionData ? (
                  <button
                    type="submit"
                  >Incluir</button>
                )
                : (
                  <button
                    disabled={true}
                  >Incluir</button>
                )
              }

            </div>
          </form>
          {
            proposals[0] ? (
              <>
                <h2 className={styles.proposalsTitle}>Propostas Mais Votadas:</h2>
                <div className={styles.div_03_E}>
                  {
                    proposals.map((p) => 
                      <Proposal 
                        key={proposals.indexOf(p)} 
                        index={proposals.indexOf(p)+1}
                        proposalData={p}
                        handleDeleteProposal={handleDeleteProposal}
                        handleDownvote={handleDownvote}
                        handleGiphyApi={handleGiphyApi}
                        handleRelevance={handleRelevance}
                        handleUnClickDownvote={handleUnClickDownvote}
                        handleUnClickUpvote={handleUnClickUpvote}
                        handleUpvote={handleUpvote}
                        giphyData={giphyData}
                        searchword={searchword}
                        setSearchword={setSearchword}
                      />
                    )
                  }
                </div>
                <p className={styles.borderline}></p>
                <h2 className={styles.proposalsByCreatedAtTitle}>Outras Propostas Sugeridas:</h2>

                <div className={styles.div_03_F}>
                  {
                    proposalsByCreatedAt.map((p) =>
                      <ProposalByCreatedAt
                        key={proposalsByCreatedAt.indexOf(p)} 
                        index={proposalsByCreatedAt.indexOf(p)+1}
                        proposalData={p}
                        handleDeleteProposal={handleDeleteProposal}
                        handleDownvote={handleDownvote}
                        handleGiphyApi={handleGiphyApi}
                        handleRelevance={handleRelevance}
                        handleUnClickDownvote={handleUnClickDownvote}
                        handleUnClickUpvote={handleUnClickUpvote}
                        handleUpvote={handleUpvote}
                        giphyData={giphyData}
                        searchword={searchword}
                        setSearchword={setSearchword}
                      />
                    )
                  }
                </div>
              </>
            ) 
            : (
              <p>Não existem propostas ainda.</p>
            )
          }
        </div>

        <div className={styles.div_video_links}>
          <div className={styles.div_04}>
            <p className={styles.subtitle}>Assista ao 1º bloco do debate na Globo 2022 (2º turno):</p>
            {/* <img src="/images/test.jpg" alt="test" /> */}
            <iframe width="560" height="315" src="https://www.youtube.com/embed/EK_hxsxWF4I" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"></iframe>
            <p className={styles.subtitle}>Assista ao 2º bloco do debate na Globo 2022 (2º turno):</p>
            {/* <img src="/images/test.jpg" alt="test" /> */}
            <iframe width="560" height="315" src="https://www.youtube.com/embed/EK_hxsxWF4I" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"></iframe>
          </div>  
          <div className={styles.div_04}>
            <p className={styles.subtitle}>Assista ao 3º bloco do debate na Globo 2022 (2º turno):</p>
            {/* <img src="/images/test.jpg" alt="test" /> */}
            <iframe width="560" height="315" src="https://www.youtube.com/embed/MVeRuwkig18" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"></iframe>
            <p className={styles.subtitle}>Assista ao 4º bloco do debate na Globo 2022 (2º turno):</p>
            {/* <img src="/images/test.jpg" alt="test" /> */}
            <iframe width="560" height="315" src="https://www.youtube.com/embed/ay1QAn1rYjw" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"></iframe>
          </div>
        </div>
      </div>

      <footer className={styles.footer}>© 2023</footer>
    </SessionContext.Provider>
    
  )
}
