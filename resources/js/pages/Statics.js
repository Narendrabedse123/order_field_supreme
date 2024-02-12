import React, { useState, useEffect, Component } from 'react';
import { connect } from 'react-redux';
import Http from '../Http';
import { render } from 'react-dom'
// import Highcharts from 'highcharts'
// import HighchartsReact from 'highcharts-react-official'
import Pagination from "../components/Pagination";
import PaginationProduct from "../components/PaginationProduct";
import Protect from 'react-app-protect'
import 'react-app-protect/dist/index.css'
function Statics(props) {


    
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


    const options = {
        title: {
          text: 'My chart'
        },
        series: [{
          data: [0.3,1,1.1, 2, 3]
        }]
      }

      const [error, setError] = useState('');
      const [visits, setVisitorData] = useState([]);

      const [today_visit, setTodyaVisitorData] = useState('');
      const [total_visit, setTotalVisitorData] = useState('');
      const [unique_visite, setUniqueVisitorData] = useState('');


    useEffect(() => {

        getvisitsData() 

     }, []);

  const  getvisits = '/api/getvisits';
 
  const getvisitsData = async () => {

    //await Http.get('/authenticate/token?shop=arcadev6.myshopify.com');

   
    Http.post(getvisits)
      .then((response) => {
        console.log(response.data)

      const {data} = response.data
       setVisitorData(data)
       console.log(response.data.today_visit)

       setTodyaVisitorData(response.data.today_visit)
       setTotalVisitorData(response.data.total_visits)
       setUniqueVisitorData(response.data.unique_visits)
      })
      .catch(() => {
       
        setError('Sorry, ubable to fetch data');

      });
  };


    
return (



    <Protect sha512='719c8468c859b40ba3b6930787593eac8259d3df6578fe73191de3711bfa2188b8f62e6d0a2cf4b8a529fc06b447d66f803bb0463a4c08fbd5d1f5e8bb405cfd'>


    <div className="container py-5">
    <div className="text-center">
    
    <div className="main-header">Order Fields Supreme APP Analytics</div>

      
<div className="container staticpage" >
	
	
	<div className="col-md-4">
	    
	    <div className="panel panel-info">
          <div className="panel-heading">
            <div className="row">
              <div className="col-xs-6">
                <i className="fa fa-list-ol fa-5x"></i>
              </div>
              <div className="col-xs-6 text-right">
                <p className="announcement-heading" style={{fontSize:'xx-large',fontWeight:'bold'}}>{total_visit}</p>
                <p className="announcement-text">Total Visits</p>
              </div>
            </div>
          </div>
          {/* <a href="#">
            <div className="panel-footer announcement-bottom">
              <div className="row">
                <div className="col-xs-6">
                  View
                </div>
                <div className="col-xs-6 text-right">
                  <i className="fa fa-arrow-circle-right"></i>
                </div>
              </div>
            </div>
          </a> */}
        </div>
        
	</div>
	
	
	
	

	<div className="col-md-4">
	    
	    <div className="panel panel-warning">
          <div className="panel-heading">
            <div className="row">
              <div className="col-xs-6">
                <i className="fa fa-line-chart fa-5x"></i>
              </div>
              <div className="col-xs-6 text-right">
                <p className="announcement-heading" style={{fontSize:'xx-large',fontWeight:'bold'}}>{unique_visite} </p>
                <p className="announcement-text">Unique Visits</p>
              </div>
            </div>
          </div>
          {/* <a href="#">
            <div className="panel-footer announcement-bottom">
              <div className="row">
              <div className="col-xs-6">
                  View
                </div>
                <div className="col-xs-6 text-right">
                  <i className="fa fa-arrow-circle-right"></i>
                </div>
              </div>
            </div>
          </a> */}
        </div>
        
	</div>		
	
	


	<div className="col-md-4">
	    
	    <div className="panel panel-success">
          <div className="panel-heading">
            <div className="row">
              <div className="col-xs-6">
                <i className="fa fa-money fa-5x"></i>
              </div>
              <div className="col-xs-6 text-right">
                <p className="announcement-heading" style={{fontSize:'xx-large',fontWeight:'bold'}}> {today_visit}</p>
                <p className="announcement-text">Today's Visits </p>
              </div>
            </div>
          </div>
          {/* <a href="#">
            <div className="panel-footer announcement-bottom">
              <div className="row">
              <div className="col-xs-6">
                  View
                </div>
                <div className="col-xs-6 text-right">
                  <i className="fa fa-arrow-circle-right"></i>
                </div>
              </div>
            </div>
          </a> */}
        </div>
        
	</div>			
	
	
	
	
	    
       <div className="table-responsive" style={{paddingTop:"25px"}}>
  
	    <table className="table table-bordered table-striped table-highlight">
	        <thead>
	           <tr>
                            <th style={{textAlign:'center'}}>Store</th>

                            <th style={{textAlign:'center'}}>Menu</th>
                            <th style={{textAlign:'center'}}>Submenu</th>
                            <th style={{textAlign:'center'}}>IP</th>

                            <th style={{textAlign:'center'}}>Location</th>
                            <th style={{textAlign:'center'}}>Page Load Time(sec)</th>

                            <th style={{textAlign:'center'}}>Date</th>

	           </tr>
	        </thead>
	        <tbody>
            {visits.slice(pagination.start, pagination.end).map((vis) => ( 
	             <tr  key={vis.id}>
                      <td style={{textAlign:'center'}}>   {vis.store}     </td>

	                <td style={{textAlign:'center'}}>   {vis.menu}     </td>
	                <td style={{textAlign:'center'}}>   {vis.submenu}     </td>
                    <td style={{textAlign:'center'}}>   {vis.ip}     </td>

                    <td style={{textAlign:'center'}}>   {vis.location}     </td>
                    <td style={{textAlign:'center'}}>   {(vis.page_time/1000).toFixed(2)}     </td>

	                <td style={{textAlign:'center'}}>   {vis.visited_at}     </td>

	            </tr> 
                ))}
	           
	            
	        </tbody>
	        
	    </table>
	    
    </div>
	<Pagination
              showPerPage={showPerPage}
              onPaginationChange={onPaginationChange}
              total={visits.length}
            />


{/*        
    <div className="table-responsive">
  
  <table className="table table-bordered table-striped table-highlight">
      <thead>
         <tr>
            
                      <th style={{textAlign:'center'}}>Store Analytics</th>
                   
         </tr>
      </thead>
      <tbody>
          
          <tr>
              <td>
                
              
              </td>
            
          </tr> 
          
         
          
      </tbody>
      
  </table>
  
</div> */}

	{/* <div className="col-md-6">
	    <div id='grafico1' className="grafico"></div>
	</div>
	
	<div className="col-md-6">
	    <div id='grafico2' className="grafico"></div>
	</div>
	<div className="col-md-6">
	    <div id='grafico3' className="grafico"></div>
	</div> */}

	
	
	
	
		<div className="col-md-6">
	    <div id='grafico4' className="grafico" style={{height: "400px"}}></div>
	</div>

	
</div>

      {/* <div>
  <HighchartsReact
    highcharts={Highcharts}
    options={options}
  />
</div>


<PieChart
  data={[
    { title: 'Four', value: 20, color: '#6A2135' },
    { title: 'One', value: 10, color: '#E38627' },
    { title: 'Two', value: 15, color: '#C13C37' },
    { title: 'Three', value: 20, color: '#6A2135' },
   
  ]}

/>


<BarChart ylabel='Quantity'
                  width={700}
                  height={500}
                  margin={margin}
                  data={data}/> */}
                  {/* onBarClick={this.handleBarClick}/> */}
    </div>
  </div>
  </Protect>

);
}
export default Statics;
