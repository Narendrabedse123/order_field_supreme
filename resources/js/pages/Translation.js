
import React, { useState, useEffect,lazy  } from 'react';

import { connect } from 'react-redux';
import Http from '../Http';
//import {CopyToClipboard} from 'react-copy-to-clipboard';
import Nav from 'react-bootstrap/Nav'
import { BrowserRouter as Router, Route, Link,useHistory, Switch, browserHistory, IndexRoute } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFile, faList, faBlog,faTag,faCogs,faCode,faHandsHelping,faFileImport,faAmericanSignLanguageInterpreting,faParagraph, faReceipt, faUser, faShoppingBag,faListAlt,faCopy } from '@fortawesome/free-solid-svg-icons'
//import Cookies from 'universal-cookie';
//const cookies = new Cookies();
//import { includes } from 'lodash';
const Header = lazy(() => import("../components/Header"));




function Translation(props) {

    let shop=props.match.params.shop;
    const appurl = process.env.MIX_REACT_APP_URL_HANDLE;
    let home_url ='https://admin.shopify.com/store/'+shop.split('.',1)+'/apps/'+appurl;
    const history = useHistory();
    const [StoreData, setTodo] = useState();
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [Products, setProductsData] = useState([]);
    const [Regs, setRegData] = useState([]);
    const [Fields, setFieldData] = useState([]);
    const [Genfields, setgenFieldData] = useState([]);
    const [isActive, setisActive] = useState(true);
    const [myfields, setField] = useState([]);
    const [mydropfields, setdropField] = useState([]);
    const [Stitle, settitle] = useState("");
    const [Smsg, setSmsg] = useState("");
    const [Emsg, setEmsg] = useState("");
    const [submit, setsubmit] = useState("");
    const [header, setheader] = useState("");
    const [footer, setfooter] = useState("");
    const [confirmation, setConf] = useState("");
    const [validation, setval] = useState("");
    const [Ssubject, setsubject] = useState("");
    const [Stemplate, settemplate] = useState("");

    const getactivefields = '/api/getactivefields';
    const getfieldsstore ='/api/getfieldsbystore';

    const updatefieldlabelurl = '/api/updatefieldlabelurl';
    const getplan ='/api/getplan';
    const setupdetailsurl ='/api/setupdetails';

    const getorder ='/api/getorders';

    const [features, setFeatures] = useState([]);

    var planUrl=0;
    var genFieldData=0;
    var orderVar=0;
    useEffect(() => {

       // getFieldListActive();
        getgenFieldData();

        getplanURL()
        getOrder()
        getaddvisits();

    }, []);

   
    const  addvisits = '/api/addvisits';

    const getaddvisits = async () => {
    
        await Http.get('/authenticate/token?shop='+shop);
      
        var millisecondsLoading = genFieldData+orderVar+planUrl;
                   Http.post(addvisits,  { menu: 'field translation details', shop: shop,milisecond:millisecondsLoading  },{
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
      
    const getgenFieldData = async () => {

        var startTime = (new Date()).getTime();

        await Http.get('/authenticate/token?shop='+shop);
     
        const config={ headers: { Authorization: `Bearer ${window.sessionToken}`} }
        
        
    
        Http.post(`${getfieldsstore}`, { shop: shop,lang:props.match.params.lang},config)
        .then((response) => {
                
                const { data } = response.data;
                setFieldData(data);
              //  console.log(response.data.data);
                // setSmsg(data.Smsg);
                // setEmsg(data.Emsg);
                // setsubmit(data.submit);
                // setheader(data.header);
                // setfooter(data.footer);
                // setConf(data.confirmation);
                // setval(data.validation);
                // settitle(data.title);
                // setsubject(data.subject);
                // settemplate(data.email_template);
                var endTime = (new Date()).getTime();
                genFieldData=parseInt(endTime-startTime)
            })
            .catch(() => {
                setisActive(true);
                setError('Sorry, ubable to fetch data');

            });
    };

    const getplanURL = async()=>
    {
        var startTime = (new Date()).getTime();
  
      await Http.get('/authenticate/token?shop='+shop);
     
      const config={ headers: { Authorization: `Bearer ${window.sessionToken}`} }
      
      
  
      Http.post(`${getplan}`, { shop: shop},config)
      .then((response) => {
         const { data } = response;
        
        setFeatures(data)
  
        var endTime = (new Date()).getTime();
        planUrl=parseInt(endTime-startTime)
      })
      .catch(() => {
       
      });
  
    }
  
    const setupdetails = async () => {
        await Http.get('/authenticate/token?shop='+shop);
        Http.post(`${setupdetailsurl}`, { shop: shop},{ headers: { Authorization: `Bearer ${window.sessionToken}`} })
        .then((response) => {
                
              //  console.log("yes");
               
               
        })
      }

    
  const getOrder = async () => {
    var startTime = (new Date()).getTime();

    await Http.get('/authenticate/token?shop='+shop);
    Http.post(`${getorder}`, { shop: shop},{ headers: { Authorization: `Bearer ${window.sessionToken}`} })
    .then((response) => {
            
          //  console.log("yes");
          var endTime = (new Date()).getTime();
          orderVar=parseInt(endTime-startTime)
           
    })
  }
    const hideAlert = async () => {
        setisActive(false);

    };
    const getFieldListActive = async () => {
        await Http.get('/authenticate/token?shop='+shop);
        Http.post(`${getactivefields}`, { shop: shop},{ headers: { Authorization: `Bearer ${window.sessionToken}`} })
        .then((response) => {
          
                const { data } = response.data;

              //  console.log(data)
                setFieldData(data);

            })
            .catch(() => {
                setisActive(true);
                setError('Sorry, ubable to fetch data');

            });
    };

   

    const handleChange = e => {


        e.preventDefault();
        if(e.target.name.indexOf('dropvalues') !== -1)
        {
            const labels = e.target.name;
            const answer_array =  labels.split('_');

            setdropField({ ...mydropfields, [answer_array[1]]: e.target.value });

        } else
        {
        setField({ ...myfields, [e.target.name]: e.target.value });
        }

    

    };

    const goBack = () => {

        parent.location.reload();
        return false;
    };

 

    

    const getfields = e => {
        e.preventDefault();

        updateFieldlabel(myfields,mydropfields);


        return false;
    };



    const updateFieldlabel = async (myfields,mydropfields) => {
        await Http.get('/authenticate/token?shop='+shop);
        Http.post(`${updatefieldlabelurl}`, {mydropfields:mydropfields,myfields: myfields,shop:shop,lang:props.match.params.lang },{ headers: { Authorization: `Bearer ${window.sessionToken}`} })
        .then((response) => {
          


                getFieldListActive();
                setisActive(true);
                setSuccess('Saved');
                setupdetails();

            })
            .catch(() => {
                setisActive(true);
                setError('Sorry, ubable to fetch data');

            });
    };




    return (


        <div className="container">
            <div className="add-todos mb-5">
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
            <Nav.Link className="btn btn-primary btn-sm" href={`/showtranslation/${shop}`}>{<span> <FontAwesomeIcon icon={faAmericanSignLanguageInterpreting} /> Field Translation</span>}</Nav.Link>
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





                <div className="text-left" style={{paddingTop:"10px"}}>
                    <h5  >
                    <Link to={`/showtranslation/${shop}`} style={{background:"#022866"}} className="btn btn-dark"> Back </Link>
                        {/* <button className="btn btn-dark" href="#" style={{background:"#022866"}} onClick={() => {
                            history.goBack();
                        }}>Back</button > */}

                        <strong style={{ paddingLeft: "365px" }}> Form Field Labels in {props.match.params.name}</strong></h5>
                </div>
               
                {error && isActive && (
                    <div className="alert alert-warning alert-dismissible" role="alert">

                        <button
                            type="button"
                            className="close"
                            data-dismiss="alert"
                            aria-label="Close"
                            onClick={() => hideAlert()}
                        >
                            <span aria-hidden="true">&times;</span>
                        </button>
                        {error}
                    </div>
                )}

                {success && isActive && (
                    <div className="alert alert-primary alert-dismissible" role="alert">
                        <button
                            type="button"
                            className="close"
                            data-dismiss="alert"
                            aria-label="Close"
                            onClick={() => hideAlert()}
                        >
                            <span aria-hidden="true">&times;</span>
                        </button>
                        {success}
                    </div>
                )}
                <div className="form-group text-left viewreg">



                    <form className="form-horizontal" method="post"
                        onSubmit={getfields}>


                        <div className="table-responsive">
                            <table className="table table-bordered table-striped table-highlight">
                                <tbody>
                                    <tr>
                                        <th>Field Name</th>
                                        <th>Label</th>
                                    </tr>
                                    {Fields.map((field) => (



                                        <tr key={field.id}>


                                            <td style={{ width: "30%" }}><strong>


                                                {field.fieldsname.split("_").join(" ")}


                                            </strong></td>

                                            <td>
                                              
                                                <input type="text"  autoComplete="off" name={field.id} onChange={handleChange} defaultValue={field.value} className="form-control" />
                                                {field.dropvalues && (
                                                    <div className="form-inline">
                                                <label for={`dropvalues_${field.id}`} class="m-2">Dropdown Values :-</label>  <input type="text"  autoComplete="off" placeholder="Comma Seprated Values like Value1,Value2,Value3" name={`dropvalues_${field.id}`} id={`dropvalues_${field.id}`} onChange={handleChange} defaultValue={field.dropvalues} className="form-control" /> 
                                                </div>
                                                )}
                                                
                                                </td>


                                        </tr>
                                    ))}











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
        </div>
    );


}
const mapStateToProps = (state) => ({
    isAuthenticated: state.Auth.isAuthenticated,
    user: state.Auth.user,
});
export default connect(mapStateToProps)(Translation);

