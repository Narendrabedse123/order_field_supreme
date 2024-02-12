import React, { useState, useEffect,lazy  } from 'react';

import { connect } from 'react-redux';
import Http from '../Http';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import Nav from 'react-bootstrap/Nav'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFile, faList, faBlog,faTag,faCogs,faCode,faHandsHelping,faArrowUp,   faFileImport,faAmericanSignLanguageInterpreting,faParagraph, faReceipt, faUser, faShoppingBag,faListAlt,faCopy } from '@fortawesome/free-solid-svg-icons'
import Cookies from 'universal-cookie';
import Iframe from 'react-iframe'
const Header = lazy(() => import("../components/Header"));

const cookies = new Cookies();
import { includes } from 'lodash';

function Help(props) {
 
let shop=props.match.params.shop;
const [features, setFeatures] = useState([]);
const appurl = process.env.MIX_REACT_APP_URL_HANDLE;
let home_url ='https://admin.shopify.com/store/'+shop.split('.',1)+'/apps/'+appurl;

const getplan ='/api/getplan';
const  addvisits = '/api/addvisits';

var planUrl = 0;
useEffect(() => {

    getplanURL()
    getaddvisits();

}, []);



const getaddvisits = async () => {

    await Http.get('/authenticate/token?shop='+shop);
    var millisecondsLoading = planUrl;
  
               Http.post(addvisits,  { menu: 'help', shop: shop ,milisecond:millisecondsLoading },{
                 headers: { Authorization: `Bearer ${window.sessionToken}` }
             })
             .then((response) => {
               // getFieldData();
               // setisActive(true);
               // setSuccess('Field Order Changed.');
  
  
             })
             .catch(() => {
               setError('Sorry, ubable to fetch data');
  
             });
  }
  
  
const getplanURL = async()=>
{
  var startTime = (new Date()).getTime();

  await Http.get('/authenticate/token?shop='+shop);
 
  const config={ headers: { Authorization: `Bearer ${window.sessionToken}`} }
  
  

  Http.post(`${getplan}`, { shop: shop},config)
  .then((response) => {
     const { data } = response;
    
    setFeatures(data)
    // console.log(data)
    var endTime = (new Date()).getTime();
    planUrl=parseInt(endTime-startTime)

  })
  .catch(() => {
   
  });

}

return (



<div class="container"  style={{paddingBottom:"50px"}}>

<Header/>

<div className="mynav"> 
      <Nav className="container-fluid"> 
            <Nav.Item>
            <Nav.Link className="" href={home_url} target="_parent">{<span> <FontAwesomeIcon icon={faTag} /> Orders</span>}</Nav.Link>
            </Nav.Item>
        
            <Nav.Item>
            <Nav.Link className="" href={`/fieldsetup/${shop}`}>{<span> <FontAwesomeIcon icon={faCogs} /> Field Setup</span>}</Nav.Link>
            </Nav.Item>
           
            <Nav.Item>
            <Nav.Link className="" href={`/cartlayout/${shop}`}>{<span> <FontAwesomeIcon icon={faFile} /> Cart Layout</span>}</Nav.Link>
            </Nav.Item>
            {features.plan_id == 3?<Nav.Item>
            <Nav.Link className="" href={`/showtranslation/${shop}`}>{<span> <FontAwesomeIcon icon={faAmericanSignLanguageInterpreting} /> Field Translation</span>}</Nav.Link>
            </Nav.Item>:""}
            <Nav.Item>
            <Nav.Link className="" href={`/pagesetup/${shop}`}>{<span> <FontAwesomeIcon icon={faCode} /> Page Script</span>}</Nav.Link>
            </Nav.Item>
            <Nav.Item>
            <Nav.Link className="btn btn-primary btn-sm" href={`/help/${shop}`}>{<span> <FontAwesomeIcon icon={faHandsHelping} /> Help</span>}</Nav.Link>
            </Nav.Item>
            <Nav.Item className="ml-auto">
            <Nav.Link href={`/plan/${shop}`} className="">{ <span> <FontAwesomeIcon icon={faList}  /> Plans </span>}</Nav.Link>
            </Nav.Item>
            </Nav>
 

            <h4 style={{paddingTop:"15px"}}> <strong>Help</strong></h4> 

            <div className="table-responsive" style={{paddingTop:"22px"}}>
         
         {features.plan_id == 1 ? <>
          <div className="table-responsive">

              <h4><b>Current Plan: Basic </b></h4>
              <h4><b>$2.99 every 30 days</b></h4> 
              </div>
              </>
              :<>
              

              </>
              }
 {features.plan_id == 2  ? <>


              <div className="table-responsive">
              <hr />

              <h4><b>Current Plan: Advance</b> </h4>
              <h4><b>$5.99 every 30 days</b></h4> 
              </div>
              </>
              :
              <>
              
              </>
             }



                {features.plan_id == 3  ? <>


                          <div className="table-responsive">
                          <hr />

                          <h4><b>Current Plan: Supreme</b> </h4>
                          <h4><b>$7.99 every 30 days</b></h4> 
                          </div>
                          </>
                          :
                          <>


                         
                          </>
                }
                </div>
           
         <h3 className="text-center" style={{display:"flex",justifyContent:"center",color:"#022866",alignItems:"center",height:"200px"}}> If you have question contact &nbsp;
         
         <a className="text-center " target="_top" href={" mailto:support@arcafy.com"}> support@arcafy.com </a> </h3>
         {/* <div class="container">
  <div className="row">
    <div className="col">
    <Iframe url="https://www.youtube.com/embed/Zfz8Q7CBirc"
        width="450px"
        height="250px"
        styles ={{marginBottom:"35px"}}
        id="myId"
        className="myClassname"
        display="initial"
        allowFullScreen
        position="relative"/>
    </div>
    <div className="col">
    <Iframe url="https://www.youtube.com/embed/96GNnNTwxSE"
        width="450px"
        height="250px"
        styles ={{marginBottom:"35px"}}
        id="myId"
        className="myClassname"
        display="initial"
        allowFullScreen
        position="relative"/>
    </div>
    <div className="col">
    <Iframe url="https://www.youtube.com/embed/DogIIEJas7U"
        width="450px"
        height="250px"
        styles ={{marginBottom:"35px"}}
        id="myId"
        className="myClassname"
        display="initial"
        allowFullScreen
        position="relative"/>
    </div>
    <div className="col">
    <Iframe url="https://www.youtube.com/embed/3apTtKwwUSU"
        width="450px"
        height="250px"
        styles ={{marginBottom:"35px"}}
        id="myId"
        className="myClassname"
        display="initial"
        allowFullScreen
        position="relative"/>
    </div>
    
    
  </div>
 
</div> */}

       {/* <div class="container">
  <div className="row">
    <div className="col">
    <Iframe url="https://www.loom.com/embed/1bc0388dfe4946ae9a2731ef8b780590?hide_speed=true"
        width="450px"
        height="250px"
        styles ={{marginBottom:"35px"}}
        id="myId"
        className="myClassname"
        display="initial"
        allowFullScreen
        position="relative"/>
    </div>
    <div className="col">
    <Iframe url="https://www.loom.com/embed/a07ef8dcdce64ee5a07a0d30bd249521?hide_speed=true"
        width="450px"
        height="250px"
        styles ={{marginBottom:"35px"}}
        id="myId"
        className="myClassname"
        display="initial"
        allowFullScreen
        position="relative"/>
    </div>
    <div className="col">
    <Iframe url="https://www.loom.com/embed/82f4277a4e7e4f61b1f713690820b6f7?hide_speed=true"
        width="450px"
        height="250px"
        styles ={{marginBottom:"35px"}}
        id="myId"
        className="myClassname"
        display="initial"
        allowFullScreen
        position="relative"/>
    </div>
    <div className="col">
    <Iframe url="https://www.loom.com/embed/aa93a181f7d242639cdd92de69d696a4?hide_speed=true"
        width="450px"
        height="250px"
        styles ={{marginBottom:"35px"}}
        id="myId"
        className="myClassname"
        display="initial"
        allowFullScreen
        position="relative"/>
    </div>
    <div className="col">
    <Iframe url="https://www.loom.com/embed/af5aad2175114b5f9389c9f5656c8fbf?hide_speed=true"
        width="450px"
        height="250px"
        styles ={{marginBottom:"35px"}}
        id="myId"
        className="myClassname"
        display="initial"
        allowFullScreen
        position="relative"/>
    </div>
    <div className="col">
    <Iframe url="https://www.loom.com/embed/c7505eb6a1524e80a286ff694e98c7f7?hide_speed=true"
        width="450px"
        height="250px"
        styles ={{marginBottom:"35px"}}
        id="myId"
        className="myClassname"
        display="initial"
        allowFullScreen
        position="relative"/>
    </div>
  </div> 
 

    </div> */}

</div>

  </div>
);


}



export default Help;


