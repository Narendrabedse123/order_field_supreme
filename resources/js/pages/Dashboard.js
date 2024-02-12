import React, { useState, useEffect,lazy  } from 'react';

import { connect } from 'react-redux';
import Http from '../Http';
//import {CopyToClipboard} from 'react-copy-to-clipboard';
import Nav from 'react-bootstrap/Nav'
import { CSVLink, CSVDownload } from "react-csv";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFile, faList, faBlog,faTag,faCogs,faCode,faHandsHelping,faArrowUp,faArrowDown,faArrowsAltV,faLongArrowAltUp,faLongArrowAltDown, faFileImport,faAmericanSignLanguageInterpreting,faParagraph, faReceipt, faUser, faShoppingBag,faListAlt, faArrowsAltH } from '@fortawesome/free-solid-svg-icons'
import Cookies from 'universal-cookie';
const cookies = new Cookies();
const Header = lazy(() => import("../components/Header"));


function Dashboard(props) {


  const [todoslast, setTodoslast] = useState([{id:0}]);

  var myid = document.getElementById("props");



    if(myid != null)
    {
    var show = myid.getAttribute("data-entityId");
    const [store_id, setStoreid] = useState(show);
   
    cookies.set('store_id', show, {path: '/', sameSite: 'none', secure: true})
      
  
      var myshop= document.getElementById("shop");
      var shop= myshop.getAttribute("data-entityId");
      
  
    }

    const appurl = process.env.MIX_REACT_APP_URL_HANDLE;
    let home_url ='https://admin.shopify.com/store/'+shop.split('.',1)+'/apps/'+appurl;

const [showPerPage, setShowPerPage] = useState(10);
const [pagination, setPagination] = useState({
  start: 0,
  end: showPerPage,
});

const [paginationp, setPaginationp] = useState({
  start: 0,
  end: showPerPage,
});


const onPaginationChange = (start, end) => {
  setPagination({ start: start, end: end });
};

const onPaginationPChange = (start, end) => {
  setPaginationp({ start: start, end: end });
};


const [isActive, setisActive] = useState(true);


const [error, setError] = useState(null);
const [success, setSuccess] = useState(null);
const [successlang, setSuccesslang] = useState(null);
//const [shop, setShop] = useState('');




//const [Stores, setStoreData] = useState([]);
const [order, setOrder] = useState([]);
const [filteredData, setFilteredData] = useState([]);
const [searchEmpty, setsearchEmpty] = useState('');
const [ExportOrders, setExportOrders] = useState([]);

const [page, setPage] = useState(2);
const [Stores, setStoreData] = useState([{id:0 }]);
const [search, setSearch] = useState('');
const [lastitem, setlastitem] = useState('');
const [todosorder, setTodosOrder] = useState([{id:0}]);
const [paginationIndexorder, setPaginationIndexorder] = useState({
  activePage: 1
});
const [errorSearch, setSearchError] = useState('');
const [disabled, setDisabled] = useState(true);
const [disablednext, setDisabledNext] = useState(true);
const [loaderOff, setLoaderOff] = useState(false);

const ordersurl = '/api/getorders';
const getplan ='/api/getplan';
const getFieldList = '/api/getfields';
const setcartpage = '/api/setcartpage';
const setupdetailsurl ='/api/setupdetails'
const getcartpage = '/api/getcartpage';
const exportcsv = '/api/exportorders';
const saveusersort = '/api/savedsearch';
const getsavedsearch = '/api/getsavedsearch';
const  addvisits = '/api/addvisits';
const addstorerecord='/api/addstorerecord';

 
const [limit, setLimit] = useState(10);
const [dropdownValu, setDropdownVal] = useState(
  { shopObj: [

 { value: '10', label: '10'},
{ value: '25', label: '25'},
{ value: '100', label: '100'},
{ value: '250', label: '250'}
]
});

var tbnnav = cookies.get('tabkeymainmenu',{path: '/', sameSite: 'none', secure: true}) ? cookies.get('tabkeymainmenu',{path: '/', sameSite: 'none', secure: true}) : 'metafield';


const [tabmykey, setmytabKey] = useState(tbnnav);
const [features, setFeatures] = useState([]);
const [fieldToListing, setOrderFieldListingData] = useState([]);
const [dataNotAvail10, setDataNotAvailable10] = useState(null);
//const [dataNotAvailAll, setDataNotAvailableAll] = useState(false);


const handleChangeShopObj=(event) => {


todoslast.length=0;
todoslast.push({id:0});

     setPaginationIndexorder({
      activePage: 1
    })
     setLimit(event.target.value)
     cookies.set('limit', event.target.value, {path: '/', sameSite: 'none', secure: true})

     getOrders(0,0,event.target.value)
  }

  var planUrlVar=0;
  var loadScriptVar=0;
  var exportcsvVar=0;
  var setupVar=0
  var orderVar=0;
useEffect(() => {

  getplanURL();
  shopifyScriptLoad()
  //getFieldsToListing();
  exportCsv();
  setupdetails()
  
  var getlimit= cookies.get('limit',{path: '/', sameSite: 'none', secure: true});
  if(getlimit == undefined)
  {
    setLimit(10)
    getOrders(0,0,limit);
  }else{
  setLimit(getlimit)
  getOrders(0,0,getlimit);
  }

  getaddvisits();
  getStoreRecord();


}, []);
const getStoreRecord = async () => {
  await Http.get('/authenticate/token?shop='+shop);

    Http.post(addstorerecord,  { shop: shop},{
      headers: { Authorization: `Bearer ${window.sessionToken}` }
  })
    .then((response) => {
      //console.log(response.data.arcafy);
      const { data } = response.data;
    

    })
    .catch(() => {
      setisActive(true);
      setError('Sorry, ubable to fetch data');

    });
};
const getDataAvailable =()=>{

  setDataNotAvailable10('No data available for Export')
}

const getaddvisits = async () => {

  await Http.get('/authenticate/token?shop='+shop);
 

  var millisecondsLoading=planUrlVar+loadScriptVar+exportcsvVar+setupVar+orderVar;

             Http.post(addvisits,  { menu: 'orders', shop: shop,milisecond:millisecondsLoading },{
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
  
  

  Http.post(`${getplan}`, { shop: shop},config)
  .then((response) => {
     const { data } = response;
    
    setFeatures(data)
    // console.log(data)

    var endTime = (new Date()).getTime();
    planUrlVar=parseInt(endTime-startTime)
  })
  .catch(() => {
   
  });

}


const shopifyScriptLoad = async () => {
  var startTime = (new Date()).getTime();
  
  await Http.get('/authenticate/token?shop='+shop);
  Http.post(`${getcartpage}`, { shop: shop},{ headers: { Authorization: `Bearer ${window.sessionToken}`} })
  .then((response) => {

    const { data } = response;
   
    var endTime = (new Date()).getTime();
    loadScriptVar=parseInt(endTime-startTime)
    return;
    })

  
};
const scriptLoading = async (script) => {
  await Http.get('/authenticate/token?shop='+shop);
  Http.post(`${setcartpage}`, { shop: shop,cartpage:script},{ headers: { Authorization: `Bearer ${window.sessionToken}`} })
  .then((response) => {
  })
};

const getOrders = async(since_id,currentpgeorder,limit) =>
{
  var startTime = (new Date()).getTime();
 
 await Http.get('/authenticate/token?shop='+shop);
 const config = {
  headers: { Authorization: `Bearer ${window.sessionToken}` }
};
  const currentorderinc=currentpgeorder+1;
  setPaginationIndexorder({activePage:currentorderinc});
  // let shop=cookies.get('shop',{path: '/', sameSite: 'none', secure: true})
  // setShop(shop);
  setsearchEmpty('')
  setOrder([])
  setSearch('')
  setFilteredData([])
  if(since_id == 0)
        {
        setDisabled(true)
        }
        else
        {
         setDisabled(false)
        }
  Http.post(`${ordersurl}`, { shop: shop,since_id:since_id,limit:limit},config )
                .then((response) => {
                 
                  const { data } = response.data;
                 // console.log(data)
                  setOrder(data);
                  getFieldsToListing(data)
                  getSaveSearchData(data)
                  if(data.length == 0)
                  {
                    setLoaderOff(true)
                  }
                  if(data.length == limit)
                  {
                    setDisabledNext(false)
                  }
                  else
                  {
                    setDisabledNext(true)

                  }
                  setPage(2)
                  const newTodosorder = [...todosorder];
                  newTodosorder[currentorderinc]=({id:data[0].id });
                  setTodosOrder(newTodosorder);
                  const rowLen = data.length;
                  data.map((order, i) => {
                    if (rowLen === i + 1) {
                      setlastitem(order.id);
                    }
                    if(rowLen-1 === i )
                      {
                        const newTodoslast = [...todoslast];
                        if(newTodoslast[currentorderinc] == null)
                        {
                        newTodoslast[currentorderinc]=({id:order.id });
                        setTodoslast(newTodoslast);
                        }
                      
                      }
                  })

                  var endTime = (new Date()).getTime();
                  orderVar=parseInt(endTime-startTime)

                })
                .catch(() => {
                  setisActive(true);
                  setError('Sorry, ubable to fetch data');
          
                });    
}

const getOrdersBack = async(pageback) => 
{ 
  await Http.get('/authenticate/token?shop='+shop);

  setPaginationIndexorder({activePage:paginationIndexorder.activePage - 1})

  setOrder([])
 const store = todoslast.length;
 todoslast.map((Prev, i) => {
    if (((store-1)-pageback) === i) {
    
if(Prev.id == 0)
{
setDisabled(true)
}

      Http.post(`${ordersurl}`, { shop: shop,since_id:Prev.id,limit:limit},{ headers: { Authorization: `Bearer ${window.sessionToken}`} })
      .then((response) => {
  
        const { data } = response.data;
        setOrder(data);
        setPage(page+1)
        setDisabledNext(false)

            const rowLen = data.length;
            data.map((orderlist, i) => {
              if (rowLen === i + 1) {
                setlastitem(orderlist.id);

              }
            })
      })
      .catch(() => {
        setisActive(true);
        setError('Sorry, ubable to fetch data');
      });
     
    }
  })
}

const handleSubmit = async(e) => {
  e.preventDefault();
  await Http.get('/authenticate/token?shop='+shop);

 
 const str=search.replace(/ /g,"%20");
  
     
      Http.post(`${ordersurl}`, {shop: shop,search:str,since_id:0},{ headers: { Authorization: `Bearer ${window.sessionToken}`}})
      .then((response) => {
      const { data } = response.data;

        if(data.length > 0)
        {
         // setProductsData([])
         setsearchEmpty('');
         setFilteredData(data);
        }
        else{
        
         setsearchEmpty('Data not found');
        }


      })  
      .catch(() => {
        setisActive(true);
        setError('Sorry, ubable to fetch data');
      });


}



const setupdetails = async () => {
  var startTime = (new Date()).getTime();

  await Http.get('/authenticate/token?shop='+shop);
  Http.post(`${setupdetailsurl}`, { shop: shop},{ headers: { Authorization: `Bearer ${window.sessionToken}`} })
  .then((response) => {
          
        //  console.log("yes");
        var endTime = (new Date()).getTime();
        setupVar=parseInt(endTime-startTime)
         
  })
}


const compareByAsc = (key) => {

  compareByAscSaveDB(key);
  return function (a, b) {
    if (a[key] < b[key]) return -1;
    if (a[key] > b[key]) return 1;
    return 0;
  };
};


const getSaveSearchData = async(order) => {
 
 await Http.get('/authenticate/token?shop='+shop);
 Http.post(`${getsavedsearch}`, { shop: shop},{ headers: { Authorization: `Bearer ${window.sessionToken}`} })
   .then((response) => {

     const { data } = response.data;
    // console.log(data);
      let arrayCopy = [...order];
     // console.log(arrayCopy);

     

     if(data.order_by == 'asc')
     {
     
      arrayCopy.sort(compareByAsc(data.fieldsname));
      setOrder(arrayCopy);
     }
     else if(data.order_by == 'desc')
     {
      let arrayCopy = [...order];
      arrayCopy.sort(compareByDesc(data.fieldsname));
      setOrder(arrayCopy);
     }else
     {
      setOrder(arrayCopy);
     }

    // console.log('arrayCopy'+arrayCopy);

     //setExportOrders(data);

   })
   .catch(() => {
     setisActive(true);
     setError('Sorry, ubable to fetch data');

   });
};
const compareByAscSaveDB = async(key) => {
  await Http.get('/authenticate/token?shop='+shop);
  Http.post(`${saveusersort}`, { shop: shop,fieldsname:key,order_by:'asc'},{ headers: { Authorization: `Bearer ${window.sessionToken}`} })
    .then((response) => {

      const { data } = response.data;
      //console.log(data);
      //setExportOrders(data);

    })
    .catch(() => {
      setisActive(true);
      setError('Sorry, ubable to fetch data');

    });
};
const compareByDescSaveDB = async(key) => {
 await Http.get('/authenticate/token?shop='+shop);
 Http.post(`${saveusersort}`, { shop: shop,fieldsname:key,order_by:'desc'},{ headers: { Authorization: `Bearer ${window.sessionToken}`} })
   .then((response) => {

     const { data } = response.data;
    // console.log(data);
     //setExportOrders(data);

   })
   .catch(() => {
     setisActive(true);
     setError('Sorry, ubable to fetch data');

   });
};

const compareByDesc = (key) => {
  compareByDescSaveDB(key)
  return function (a, b) {
    if (a[key] < b[key]) return 1;
    if (a[key] > b[key]) return -1;
    return 0;
  };
};

const getFieldsToListing = async (order_data) => {
  await Http.get('/authenticate/token?shop='+shop);
  Http.post(`${getFieldList}`, { shop: shop},{ headers: { Authorization: `Bearer ${window.sessionToken}`} })
  .then((response) => {

    const { data } = response.data;

    setOrderFieldListingData(data);

    //console.log(data[0].fieldsname)
    //var newStateArray =firstfieldName.slice();
   // newStateArray.push(data[0].fieldsname);
   sortByFirstOrder(order_data,data[0].fieldsname)
  
  })
};


const sortByFirstOrder = (data,key) => {
  let arrayCopy = [...data];
  
  const arrInStr = JSON.stringify(arrayCopy);
  //console.log('firstfield=='+key);

  //arrayCopy.sort(compareByAsc(key));
  const arrInStr1 = JSON.stringify(arrayCopy);
  //console.log(arrInStr1);

  if (arrInStr === arrInStr1) {
    arrayCopy.sort(compareByDesc(key));
  }
   
 
//  console.log(arrayCopy);
  setOrder(arrayCopy);
};

const sortBy = (key) => {
  let arrayCopy = [...order];
  
  const arrInStr = JSON.stringify(arrayCopy);
  arrayCopy.sort(compareByAsc(key));

  const arrInStr1 = JSON.stringify(arrayCopy);
  if (arrInStr === arrInStr1) {
    arrayCopy.sort(compareByDesc(key));
  }
  //console.log(arrayCopy);
  setOrder  (arrayCopy);
};

const exportCsv = async () => {
  var startTime = (new Date()).getTime();

  await Http.get('/authenticate/token?shop='+shop);
  Http.post(`${exportcsv}`, { shop: shop},{ headers: { Authorization: `Bearer ${window.sessionToken}`} })
    .then((response) => {

      const { data } = response.data;
     // console.log(data);
      setExportOrders(data);
      var endTime = (new Date()).getTime();
      exportcsvVar=parseInt(endTime-startTime)
    })
    .catch(() => {
      setisActive(true);
      setError('Sorry, ubable to fetch data');

    });



};


const gethref = () => {
  
  var href = $("#csvexport").attr('href');
    window.open(href,'_blank')

  return false;
}
return (



<div class="container"  style={{paddingBottom:"50px"}}>
<Header/>


<div className="mynav"> 
      <Nav className="container-fluid"> 
            <Nav.Item>
            <Nav.Link className="btn btn-primary btn-sm" href={home_url} target="_parent">{<span> <FontAwesomeIcon icon={faTag} /> Orders</span>}</Nav.Link>
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
            <Nav.Link className="" href={`/help/${shop}`}>{<span> <FontAwesomeIcon icon={faHandsHelping} /> Help</span>}</Nav.Link>
            </Nav.Item>
            {/* className="ml-auto" */}
            <Nav.Item className="ml-auto">
            <Nav.Link href={`/plan/${shop}`} className="">{ <span> <FontAwesomeIcon icon={faList}  /> Plans </span>}</Nav.Link>
            </Nav.Item>
            </Nav>
 </div>

 <div className="row justify-content-left" style={{marginLeft:"1px",marginBottom:"-69px"}}>
        <div className="form-group form-inline text-center"> 

        <select className="form-control" value={limit} onChange={handleChangeShopObj} required>
          
          {dropdownValu.shopObj.map(v => (
              <option value={v.value}>{v.label}</option>
            ))};
          </select>

            <nav aria-label="Page navigation example" style={{paddingTop:"14px",paddingLeft:"10px"}}>
                      
                      <ul className="pagination justify-content-center">
                        <li className="page-link">
                          {disabled ? 
                           <a disabled aria-label="Previous">
                            <span aria-hidden="true" >&laquo;</span>
                            <span className="sr-only">Previous</span>
                          </a>: <a onClick={()=>getOrdersBack(page)} aria-label="Previous">
                            <span aria-hidden="true" >&laquo;</span>
                            <span className="sr-only">Previous</span>
                          </a>}
                         
                        </li>
                        
                        <li  className="page-link">

                        {disablednext ?  <a disabled aria-label="Next">
                            <span aria-hidden="true">&raquo;</span>
                            <span className="sr-only">Next</span>
                          </a>: <a onClick={()=>getOrders(lastitem,paginationIndexorder.activePage,limit)} aria-label="Next">
                            <span aria-hidden="true">&raquo;</span>
                            <span className="sr-only">Next</span>
                          </a>}
                          
                        </li>
                      </ul>
                    </nav>
            </div> 

</div>               
{features.plan_id == 2 &&
<>
{ExportOrders.length > 0 ?
<CSVLink 
id="csvexport"        
filename={"registrations.csv"}
className="btn btn-dark" 
data={ExportOrders}
onClick={ gethref}
style={{background:"rgb(2 40 102)",float:'left',marginLeft:"168px"}}
download> 
Download Last 10 Orders
</CSVLink>
:
<button type="button" onClick={()=>getDataAvailable()} style={{background:"rgb(2 40 102)",float:'left',marginLeft:"168px"}}className="btn  btn-dark">Download Last 10 Orders

</button>

}
</>
}
{features.plan_id == 3 &&

<>
{ExportOrders.length > 0 ?
  <CSVLink 
id="csvexport"        
filename={"registrations.csv"}
className="btn btn-dark" 
data={ExportOrders}
style={{background:"rgb(2 40 102)",float:'left',marginLeft:"168px"}}
onClick={ gethref}
download> 
Download All Orders</CSVLink>

:
<button type="button" onClick={()=>getDataAvailable()} style={{background:"rgb(2 40 102)",float:'left',marginLeft:"168px"}}className="btn  btn-dark">Download Last 10 Orders

</button>

}
</>
}





<form  onSubmit={handleSubmit}>
{features.plan_id == 1 ?(
<span className="float-center" style={{paddingTop:"6px",fontSize:"1.35rem",marginLeft:"300px"}} > <strong>Orders</strong></span>
  ) : (
  <span className="float-center" style={{paddingTop:"6px",fontSize:"1.35rem"}} > <strong>Orders</strong></span>
)}
<div className="input-group" style={{float:"right",marginBottom:"10px",width:"400px"}}>
  <input type="text"  id="search"
                  name="search"
                  autoComplete="off"
                  value={search} onChange={e => setSearch(e.target.value)}
                  placeholder="Please enter Order ID" className="form-control" required/>
  <button className="btn btn-dark"  type="submit"  style={{
                         backgroundColor:'#022866'}}>Search</button>
                        
                        
                         <button type="button" onClick={()=>getOrders(0,0,limit)}  style={{
                         backgroundColor:'#022866',
                         marginLeft:'10px'
                          
                         }}
                         className="btn  btn-dark">Reset
</button>
</div>
</form>
  {success && (
                          <div style={{marginTop:"20px"}} className="alert alert-primary text-center" role="alert">
                          {success}
                          </div>
                          )}

{dataNotAvail10 && (
                          <div style={{marginTop:"20px"}} className="alert alert-primary text-center" role="alert">
                          {dataNotAvail10}
                          </div>
                          )}





{searchEmpty != '' ? (
                         <>
                         <div style={{paddingTop:"0px"}} className="table-responsive" >
                       
                          <table className="table table-bordered table-striped table-highlight">
                            <tbody>
                              <tr>
                               
                                <th className="text-center" style={{width:"100%"}}>Order</th>
                               
                               
                              </tr>
                              <tr>
                               <td className="text-center"> {searchEmpty}</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                        
            </>
  ) :

                filteredData.length > 0 ? 
                <>
                  
                      <div style={{paddingTop:"0px"}} className="table-responsive">
                      
                      <table className="table table-bordered table-striped table-highlight">
                        <tbody>
                          <tr>

                          <th className="text-center"  style={{width:"10%"}}>Order Number</th>
                            <th className="text-center"  style={{width:"15%"}}>Name/ Email</th>
                            <th className="text-center"   style={{width:"10%"}}>Order Date</th>
                            {fieldToListing.map((fieldlist, index) => (
                              
                                <th
                                  onClick={() =>
                                    sortBy(fieldlist.fieldsname.split(" ").join("_").toLowerCase())
                                  }
                                  className="text-center"
                                  style={{ width: "10%", color: "#ffffff" }}
                                >
                                  {fieldlist.fieldsname.split("_").join(" ")}
                                </th>
                           ))}
                           </tr>
                              {filteredData.map((todo) => (

                              <tr key={todo.id}>

                                <td className="text-center">#{todo.order_number }</td>
                                <td className="text-center">
                                  {" "}
                                  {todo.first_name} {todo.last_name}{" "}
                                  {todo.first_name == "" || todo.email =="" ? "" : "/"} {todo.email}
                                </td>
                                <td className="text-center"> {todo.created_at}</td>

                                {fieldToListing.map((fieldlist, index) => (
                                  <>
                                    {(() => {
                                      var field = fieldlist.fieldsname
                                        .split(" ")
                                        .join("_");

                                      if (true) {
                                        return (
                                          <td className="text-center"> {todo[field]}</td>
                                        );
                                      }
                                    })()}
                                  </>
                                ))}
                                </tr>
                              ))}
                        </tbody>
                      </table>
                    </div>


                    </>

:

<>



            <div style={{paddingTop:"0px"}} className="table-responsive">
             
              <table className="table table-bordered table-striped table-highlight">
                <tbody>
                  <tr>

                            <th className="text-center"  style={{width:"12%"}}>Order Number   </th>
                            <th className="text-center" style={{width:"15%"}}>Name/ Email   </th>
                            <th className="text-center"   style={{width:"10%"}}>Order Date  </th>
                            {fieldToListing.map((fieldlist, index) => (
                                <th
                                  
                                  className="text-center"
                                  style={{ width: "10%", color: "#ffffff" }}
                                >
                                  {fieldlist.fieldsname.split("_").join(" ")}  
                                </th>
                           ))}

                  </tr>
                  {order.map((todo) => (

                    <tr key={todo.id}>
                  
                      <td className="text-center"><a href={`https://${shop}/admin/orders/${todo.id}`} target='_blank'> #{todo.order_number} </a></td>
                      <td className="text-center">
                        {" "}
                        {todo.first_name} {todo.last_name}{" "}
                        {todo.first_name == "" || todo.email =="" ? "" : "/"} {todo.email}
                      </td>
                      <td className="text-center"> {todo.created_at}</td>

                      {fieldToListing.map((fieldlist, index) => (
                        <>
                          {(() => {
                            var field = fieldlist.fieldsname
                              .split(" ")
                              .join("_");

                            if (true) {
                              return (
                                <td className="text-center"> {todo[field]}</td>
                              );
                            }
                          })()}
                        </>
                      ))}
                      </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <nav aria-label="Page navigation example">
                      
                      <ul className="pagination justify-content-center">
                        <li className="page-link">
                          {disabled ? 
                           <a disabled aria-label="Previous">
                            <span aria-hidden="true" >&laquo;</span>
                            <span className="sr-only">Previous</span>
                          </a>: <a onClick={()=>getOrdersBack(page)} aria-label="Previous">
                            <span aria-hidden="true" >&laquo;</span>
                            <span className="sr-only">Previous</span>
                          </a>}
                         
                        </li>
                        
                        <li  className="page-link">
                        {disablednext ?  <a disabled aria-label="Next">
                            <span aria-hidden="true">&raquo;</span>
                            <span className="sr-only">Next</span>
                          </a>: <a onClick={()=>getOrders(lastitem,paginationIndexorder.activePage,limit)} aria-label="Next">
                            <span aria-hidden="true">&raquo;</span>
                            <span className="sr-only">Next</span>
                          </a>}
                        </li>
                      </ul>
                    </nav> 

               </>








}












  </div>
);


}





const mapStateToProps = (state) => ({
  isAuthenticated: state.Auth.isAuthenticated,
  user: state.Auth.user,
});
export default connect(mapStateToProps)(Dashboard);


