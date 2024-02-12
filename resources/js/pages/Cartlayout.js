import React, { useState, useEffect,lazy  } from 'react';

import Http from '../Http';
import Nav from 'react-bootstrap/Nav'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFile, faList, faBlog,faTag,faCogs,faCode,faHandsHelping,faFileImport,faAmericanSignLanguageInterpreting,faParagraph, faReceipt, faUser, faShoppingBag,faListAlt,faCopy } from '@fortawesome/free-solid-svg-icons'
//import Cookies from 'universal-cookie';
//const cookies = new Cookies();
//import InputColor from 'react-input-color';
import FontPicker from "font-picker-react";
import { SketchPicker } from 'react-color';
const Header = lazy(() => import("../components/Header"));

const CartLayout = (props) => {

    
let shop=props.match.params.shop;
const appurl = process.env.MIX_REACT_APP_URL_HANDLE;
let home_url ='https://admin.shopify.com/store/'+shop.split('.',1)+'/apps/'+appurl;
const [picture, setPicture] = useState("");
const [colorbg, setbgColor] = useState("#d3d3d3");
const [colorbgright, setbgColorRight] = useState("#4835d4");
const [colortext, settextColor] = useState("#022866");
const [colortextright, settextColorRight] = useState("#ffffff");
const [fontstyle, setfontstyle] = useState("Josefin Sans");
const [fontsize, setfontsize] = useState("18");
const [colorbg2, setbgColor2] = useState("#d3d3d3");
const [colorbgright2, setbgColorRight2] = useState("#4835d4");
const [colortext2, settextColor2] = useState("#022866");
const [colortextright2, settextColorRight2] = useState("#ffffff");
const [colorbutton, setbuttonColor] = useState("#f5e045ff");
const [colortextbutton, setbuttontextColor] = useState("#022866");
const [colortextbutton2, setbuttontextColor2] = useState("#022866");
const [colorbutton2, setbuttonColor2] = useState("#f5e045ff");
const [Regs, setRegData] = useState([]);
const [success, setSuccess] = useState(null);
const [isActive, setisActive] = useState(true);


const [error, setError] = useState(null);
const [successlang, setSuccesslang] = useState(null);

const [Langdata, setLangData] = useState([]);
const [Langfr, setfrLangData] = useState([]);
const [Stores, setStoreData] = useState([]);
const [Arcafy, setArcafyStore] = useState([]);
const [token, settoken] = useState(window.sessionToken);

const [features, setFeatures] = useState([]);

const [Email, setEmailData] = useState([]);
const [adminemail, setAdminEmail] = useState("");
const [emailtemp, setEmailTemp] = useState("");
const [senderemail, setSenderEmail] = useState("");
const getactivefields= '/api/getactivefields';
const updatecartlayout = '/api/updatecartlayout';
const setupdetailsurl ='/api/setupdetails';
const getcartlayout ='/api/getcartlayout';
const getplan ='/api/getplan';

var CartLayoutVar=0;
var planUrl=0;

useEffect(() => {

  
  getplanURL();

  //getFieldListActive();
  getcartlayout1();
  getaddvisits();
}, []);



const  addvisits = '/api/addvisits';



const getaddvisits = async() => {

  await Http.get('/authenticate/token?shop='+shop);
  var millisecondsLoading = CartLayoutVar+planUrl;

             Http.post(addvisits,  { menu: 'cart layout', shop: shop,milisecond:millisecondsLoading  },{
               headers: { Authorization: `Bearer ${window.sessionToken}` }
           })
           .then((response) => {
             // getFieldData();
             // setisActive(true);
             // setSuccess('Field Order Changed.');


           })
           .catch(() => {
             setisActive(true);
             setError('Sorry, ubable to fetch data');

           });
}


const getplanURL = async()=>
{
  var startTime = (new Date()).getTime();

  await Http.get('/authenticate/token?shop='+shop);
 
  const config={ headers: { Authorization: `Bearer ${window.sessionToken}`} }
  
  
 //console.log(config)

  Http.post(`${getplan}`, { shop: shop},config)
  .then((response) => {
     const { data } = response;
    
    setFeatures(data)
   //  console.log(data)

   var endTime = (new Date()).getTime();
   planUrl=parseInt(endTime-startTime)   
  })
  .catch(() => {
   
  });

}


const getcartlayout1 =async()=>{
  var startTime = (new Date()).getTime();

  await Http.get('/authenticate/token?shop='+shop);
   
  const config = {
    headers: { Authorization: `Bearer ${window.sessionToken}` }
};
  Http.post(getcartlayout, {shop:shop},config)

    .then((response) => {

      const { data } = response.data;
    
     // console.log(data)
     // setFeatures(data);

      if (!(data.font)) {
        setfontstyle("Josefin Sans");
      }
      else {
        setfontstyle(data.font);
      }
      if (!(data.color)) {
        settextColor("#022866");
      }
      else {

        settextColor(data.color);

      }
      if (!(data.bgcolor)) {
        setbgColor("#d3d3d3");
      }
      else {
        setbgColor(data.bgcolor);
      }
      
      // if (!(data.color)) {
      //   settextColor2("#022866");
      // }
      // else {
      //   settextColor2(data.color);
      // }
      // if (!(data.bgcolor)) {
      //   setbgColor2("#d3d3d3");
      // }
      // else {
      //   setbgColor2(data.bgcolor);
      // }
      var endTime = (new Date()).getTime();
      CartLayoutVar=parseInt(endTime-startTime)
    })

}

const getpage = e => {
    e.preventDefault();
    updatePagesetup(colorbg, colortext, fontstyle);
    return false;
  };


  const updatePagesetup = async (colorbgval, colortextval, fontstyleval) => 
  {

    await Http.get('/authenticate/token?shop='+shop);
   
    const config = {
      headers: { Authorization: `Bearer ${window.sessionToken}` }
  };
    Http.post(updatecartlayout, {shop:shop,background: colorbgval, textcolor: colortextval, font_style: fontstyleval},config)

      .then((response) => {


       // getEmailData();
        setisActive(true);

        setSuccess('Page setup updated successfully.');
        setupdetails();
        getcartlayout1();
       // getRegisteredData();
      })
      .catch(() => {
        setisActive(true);
        setError('Sorry, ubable to fetch data');

      });
  };
  const setupdetails = async () => {
  var startTime = (new Date()).getTime();

    await Http.get('/authenticate/token?shop='+shop);
    Http.post(`${setupdetailsurl}`, { shop: shop},{ headers: { Authorization: `Bearer ${window.sessionToken}`} })
    .then((response) => {
            
          //  console.log("yes");
           
          var endTime = (new Date()).getTime();
          setup=parseInt(endTime-startTime)   
    })
  }
  //

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
            <Nav.Link className="btn btn-primary btn-sm" href={`/cartlayout/${shop}`}>{<span> <FontAwesomeIcon icon={faFile} /> Cart Layout</span>}</Nav.Link>
            </Nav.Item>
            {features.plan_id == 3? <Nav.Item>
           <Nav.Link className="" href={`/showtranslation/${shop}`}>{<span> <FontAwesomeIcon icon={faAmericanSignLanguageInterpreting} /> Field Translation</span>}</Nav.Link>
            </Nav.Item>:""}
            <Nav.Item>
            <Nav.Link className="" href={`/pagesetup/${shop}`}>{<span> <FontAwesomeIcon icon={faCode} /> Page Script</span>}</Nav.Link>
            </Nav.Item>
            <Nav.Item>
            <Nav.Link className="" href={`/help/${shop}`}>{<span> <FontAwesomeIcon icon={faHandsHelping} /> Help</span>}</Nav.Link>
            </Nav.Item>
            <Nav.Item className="ml-auto">
            <Nav.Link href={`/plan/${shop}`} className="">{ <span> <FontAwesomeIcon icon={faList}  /> Plans </span>}</Nav.Link>
            </Nav.Item>
            </Nav>
 
</div>

<h4 style={{paddingTop:"15px"}}> <strong>Cart Layout</strong></h4> 

{success && isActive && (
            <div style={{marginTop:"20px"}} className="alert alert-primary text-center" role="alert">
            {success}
            </div>
        )}



            <div className="add-todos mb-5" style={{paddingTop:"10px"}}>
              <form className="form-horizontal" method="post"
                onSubmit={getpage} >

                <div className="table-responsive">
                  <table className="table table-bordered table-striped table-highlight">
                    <tbody>

                      <tr>

                        <td style={{ width: "30%",paddingTop:"150px" }}><strong>  Background Color  </strong></td>

                        <td style={{textAlign:'-webkit-center'}}>
                          
                        <SketchPicker
        color={colorbg}
        onChange={e => setbgColor(e.hex)} />
                          
                          {/* <InputColor
                          name="background"
                          initialValue={colorbg2}
                          onChange={setbgColor}
                          placement="right"
                          style={{ width: "200px", height: "35px" }}
                          required
                        /> */}
                        
                        </td>
                      </tr>
                      <tr >
                        <td style={{ width: "30%",paddingTop:"150px" }}><strong>


                          Text Color


    </strong></td>
                        <td style={{textAlign:'-webkit-center'}}>

                        <SketchPicker
        color={colortext}
        onChange={e => settextColor(e.hex)} />
                          {/* <InputColor
                            name="text_color"
                            initialValue={colortext2}
                            onChange={settextColor}
                            style={{ width: "200px", height: "35px" }}
                            placement="right"
                            required
                          /> */}
                        </td>
                      </tr>

                      <tr>
                        <td style={{ width: "30%" }}><strong>   Font   </strong></td>
                        <td>
                          <FontPicker

                            apiKey="AIzaSyDP7J2ta68L8xxkWC0UYJxFhj8fwEQvfz4"
                            activeFontFamily={fontstyle}
                            onChange={(nextFont) =>
                              setfontstyle(nextFont.family)
                            }
                          />
                        </td>
                      </tr>
                     
                    </tbody>
                  </table>
                  <div className="form-group text-center">
                    <button type="submit" className="btn btn-dark text-center" style={{background:"#022866"}}><strong>Submit </strong>

                    </button>


                  </div>



                </div>

              </form>







  </div>
  </div>
);


}



export default CartLayout;


