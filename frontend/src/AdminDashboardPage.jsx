// src/AdminDashboardPage.jsx
import React, { useState, useEffect } from 'react';
// We are not using styled-components for the main dashboard visual structure anymore,
// but keeping them in your project is fine for other pages.
// If you want to keep using styled-components for minor elements within the dashboard
// you would define them here, but not for the main layout classes.
// import styled from 'styled-components'; // No longer strictly needed if only using template classes

// Recharts components
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line
} from 'recharts';

// React Icons (ensure installed: npm install react-icons)
import {
  FaUser, FaChartLine, FaTasks, FaDollarSign, FaSearch, FaBell, FaCog,
  FaAngleDown, FaChartBar, FaGlobe, FaSignInAlt, FaUserPlus, FaStar,
  FaTimes, FaHeart, FaFacebookF, FaTwitter
} from 'react-icons/fa';

// Import your sample data
import sampleData from './data/sampleQuestionnaireData.json';

// --- Dashboard Component ---

const AdminDashboardPage = () => {
  // --- Data Processing (re-using from previous version) ---
  const totalResponses = sampleData.length;
  const totalUsers = totalResponses;
  const getPercentageChange = (current, previous) => {
    if (previous === 0) return 'N/A';
    const change = ((current - previous) / previous) * 100;
    return `${change.toFixed(0)}%`;
  };
  const completedResponses = sampleData.filter(
    (response) => response.social_impact && response.mindset_change !== undefined
  ).length;
  const avgCompletionRate = totalResponses > 0
    ? `${((completedResponses / totalResponses) * 100).toFixed(0)}%`
    : '0%';

  const kpiData = {
    money: { value: `$${(sampleData.length * 50).toLocaleString()}k`, change: getPercentageChange(sampleData.length * 50, 45000), label: "Total Estimated Value", icon: <FaDollarSign /> },
    users: { value: `${totalUsers} Users`, change: getPercentageChange(totalUsers, totalUsers - 5), label: "Total Participants", icon: <FaUser /> },
    adsViews: { value: `${(sampleData.length * 150).toLocaleString()}`, change: getPercentageChange(sampleData.length * 150, 1500), label: "Survey Views", icon: <FaChartLine /> },
    sales: { value: `${totalResponses} Completed`, change: getPercentageChange(totalResponses, totalResponses - 2), label: "Total Responses", icon: <FaTasks /> }
  };

  const educationDistribution = sampleData.reduce((acc, curr) => {
    const educationLevel = curr.education;
    if (educationLevel) {
      const labelMap = { "no_formal": "No Formal", "below_5th": "< 5th Std", "below_8th": "< 8th Std", "up_to_12th": "Up to 12th", "graduation": "Graduation/Dip", "post_graduation": "Post Grad+" };
      acc[labelMap[educationLevel] || educationLevel] = (acc[labelMap[educationLevel] || educationLevel] || 0) + 1;
    }
    return acc;
  }, {});
  const educationChartData = Object.keys(educationDistribution).map(key => ({ name: key, Responses: educationDistribution[key] }));

  const monthlyResponses = sampleData.reduce((acc, curr) => {
    const month = curr.submission_month;
    if (month) { acc[month] = (acc[month] || 0) + 1; }
    return acc;
  }, {});
  const monthOrder = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const responsesOverTimeData = monthOrder.map(month => ({ name: month, "Daily Responses": monthlyResponses[month] || 0 }));

  const discriminationImpact = sampleData.reduce((acc, curr) => {
    const impact = curr.discrimination_reduction;
    if (impact) {
      const labelMap = { "yes": "Yes", "some_extent": "Some Extent", "no": "No" };
      acc[labelMap[impact] || impact] = (acc[labelMap[impact] || impact] || 0) + 1;
    }
    return acc;
  }, {});
  const discriminationChartData = Object.keys(discriminationImpact).map(key => ({ name: key, Count: discriminationImpact[key] }));

  const recentProjects = sampleData.slice(-3).reverse().map(resp => ({
    company: resp.name || `User ${resp.id.split('_')[1]}`,
    members: `${resp.age} yrs, ${resp.gender}`,
    budget: resp.income_before ? `₹${resp.income_before.split('_')[0]}k` : 'N/A',
    completion: resp.social_impact ? 'Completed' : 'Partial',
  }));

  const ordersOverviewData = [
    { title: 'New Participant Form', status: 'success', value: '+2400', time: '23 DEC 7:20 PM' },
    { title: 'Dashboard Changes', status: 'pending', value: '24%', time: '21 DEC 11 PM' },
    { title: 'Questionnaire Update', status: 'success', value: '+1000', time: '18 DEC 4:54 AM' },
    { title: 'Database Migration', status: 'pending', value: '50%', time: '17 DEC 3:00 PM' },
  ];

  // State for sidebar visibility (if you want to implement a mobile toggle)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Helper function to dynamically add class for positive/negative change
  const getChangeClass = (change) => {
    if (typeof change !== 'string') return '';
    return change.startsWith('+') ? 'positive' : 'negative';
  };

  return (
    <div className="g-sidenav-show bg-gray-100"> {/* Main wrapper from template body */}
      {/* Sidebar */}
      <aside className={`sidenav navbar navbar-vertical navbar-expand-xs border-radius-lg fixed-start ms-2 bg-white my-2 ${isSidebarOpen ? 'show' : ''}`} id="sidenav-main">
        <div className="sidenav-header">
          <i className="fas fa-times p-3 cursor-pointer text-dark opacity-5 position-absolute end-0 top-0 d-none d-xl-none" aria-hidden="true" id="iconSidenav" onClick={() => setIsSidebarOpen(false)}></i>
          <a className="navbar-brand px-4 py-3 m-0" href="/"> {/* Changed href to React Router link to root */}
            <img src="/assets/img/logo-ct-dark.png" className="navbar-brand-img" width="26" height="26" alt="main_logo" />
            <span className="ms-1 text-sm text-dark">Creative Tim</span>
          </a>
        </div>
        <hr className="horizontal dark mt-0 mb-2" />
        <div className="collapse navbar-collapse w-auto" id="sidenav-collapse-main">
          <ul className="navbar-nav">
            <li className="nav-item">
              <a className="nav-link text-dark active bg-gradient-primary" href="/admin-dashboard"> {/* Active dashboard link */}
                <i className="material-symbols-rounded opacity-5">dashboard</i>
                <span className="nav-link-text ms-1">Dashboard</span>
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link text-dark" href="/tables"> {/* Placeholder route */}
                <i className="material-symbols-rounded opacity-5">table_view</i>
                <span className="nav-link-text ms-1">Tables</span>
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link text-dark" href="/billing"> {/* Placeholder route */}
                <i className="material-symbols-rounded opacity-5">receipt_long</i>
                <span className="nav-link-text ms-1">Billing</span>
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link text-dark" href="/virtual-reality"> {/* Placeholder route */}
                <i className="material-symbols-rounded opacity-5">view_in_ar</i>
                <span className="nav-link-text ms-1">Virtual Reality</span>
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link text-dark" href="/rtl"> {/* Placeholder route */}
                <i className="material-symbols-rounded opacity-5">format_textdirection_r_to_l</i>
                <span className="nav-link-text ms-1">RTL</span>
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link text-dark" href="/notifications"> {/* Placeholder route */}
                <i className="material-symbols-rounded opacity-5">notifications</i>
                <span className="nav-link-text ms-1">Notifications</span>
              </a>
            </li>
            <li className="nav-item mt-3">
              <h6 className="ps-4 ms-2 text-uppercase text-xs text-dark font-weight-bolder opacity-5">Account pages</h6>
            </li>
            <li className="nav-item">
              <a className="nav-link text-dark" href="/profile"> {/* Placeholder route */}
                <i className="material-symbols-rounded opacity-5">person</i>
                <span className="nav-link-text ms-1">Profile</span>
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link text-dark" href="/signin"> {/* Link to Sign In page */}
                <i className="material-symbols-rounded opacity-5">login</i>
                <span className="nav-link-text ms-1">Sign In</span>
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link text-dark" href="/signup"> {/* Link to Sign Up page */}
                <i className="material-symbols-rounded opacity-5">assignment</i>
                <span className="nav-link-text ms-1">Sign Up</span>
              </a>
            </li>
          </ul>
        </div>
        <div className="sidenav-footer position-absolute w-100 bottom-0 ">
          <div className="mx-3">
            <a className="btn btn-outline-dark mt-4 w-100" href="https://www.creative-tim.com/learning-lab/bootstrap/overview/material-dashboard?ref=sidebarfree" type="button">Documentation</a>
            <a className="btn bg-gradient-dark w-100" href="https://www.creative-tim.com/product/material-dashboard-pro?ref=sidebarfree" type="button">Upgrade to pro</a>
          </div>
        </div>
      </aside>

      <main className="main-content position-relative max-height-vh-100 h-100 border-radius-lg ">
        {/* Navbar */}
        <nav className="navbar navbar-main navbar-expand-lg px-0 mx-3 shadow-none border-radius-xl" id="navbarBlur" data-scroll="true">
          <div className="container-fluid py-1 px-3">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb bg-transparent mb-0 pb-0 pt-1 px-0 me-sm-6 me-5">
                <li className="breadcrumb-item text-sm"><a className="opacity-5 text-dark" href="/">Pages</a></li>
                <li className="breadcrumb-item text-sm text-dark active" aria-current="page">Dashboard</li>
              </ol>
              <h6 className="font-weight-bolder mb-0">Dashboard</h6>
            </nav>
            <div className="collapse navbar-collapse mt-sm-0 mt-2 me-md-0 me-sm-4" id="navbar">
              <div className="ms-md-auto pe-md-3 d-flex align-items-center">
                <div className="input-group input-group-outline">
                  <label className="form-label">Type here...</label>
                  <input type="text" className="form-control" />
                </div>
              </div>
              <ul className="navbar-nav d-flex align-items-center justify-content-end">
                <li className="nav-item d-flex align-items-center">
                  <a className="btn btn-outline-primary btn-sm mb-0 me-3" target="_blank" href="https://www.creative-tim.com/builder?ref=navbar-material-dashboard">Online Builder</a>
                </li>
                <li className="mt-1">
                  <a className="github-button" href="https://github.com/creativetimofficial/material-dashboard" data-icon="octicon-star" data-size="large" data-show-count="true" aria-label="Star creativetimofficial/material-dashboard on GitHub">Star</a>
                </li>
                <li className="nav-item d-xl-none ps-3 d-flex align-items-center">
                  <a href="javascript:;" className="nav-link text-body p-0" id="iconNavbarSidenav" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                    <div className="sidenav-toggler-inner">
                      <i className="sidenav-toggler-line"></i>
                      <i className="sidenav-toggler-line"></i>
                      <i className="sidenav-toggler-line"></i>
                    </div>
                  </a>
                </li>
                <li className="nav-item px-3 d-flex align-items-center">
                  <a href="javascript:;" className="nav-link text-body p-0">
                    <i className="material-symbols-rounded fixed-plugin-button-nav">settings</i>
                  </a>
                </li>
                <li className="nav-item dropdown pe-3 d-flex align-items-center">
                  <a href="javascript:;" className="nav-link text-body p-0" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">
                    <i className="material-symbols-rounded">notifications</i>
                  </a>
                  <ul className="dropdown-menu dropdown-menu-end px-2 py-3 me-sm-n4" aria-labelledby="dropdownMenuButton">
                    <li className="mb-2">
                      <a className="dropdown-item border-radius-md" href="javascript:;">
                        <div className="d-flex py-1">
                          <div className="my-auto">
                            <img src="/assets/img/team-2.jpg" className="avatar avatar-sm me-3 " alt="Team 2" />
                          </div>
                          <div className="d-flex flex-column justify-content-center">
                            <h6 className="text-sm font-weight-normal mb-1">
                              <span className="font-weight-bold">New message</span> from Laur
                            </h6>
                            <p className="text-xs text-secondary mb-0">
                              <i className="fa fa-clock me-1"></i>
                              13 minutes ago
                            </p>
                          </div>
                        </div>
                      </a>
                    </li>
                    <li className="mb-2">
                      <a className="dropdown-item border-radius-md" href="javascript:;">
                        <div className="d-flex py-1">
                          <div className="my-auto">
                            <img src="/assets/img/small-logos/logo-spotify.svg" className="avatar avatar-sm bg-gradient-dark me-3 " alt="Spotify Logo" />
                          </div>
                          <div className="d-flex flex-column justify-content-center">
                            <h6 className="text-sm font-weight-normal mb-1">
                              <span className="font-weight-bold">New album</span> by Travis Scott
                            </h6>
                            <p className="text-xs text-secondary mb-0">
                              <i className="fa fa-clock me-1"></i>
                              1 day
                            </p>
                          </div>
                        </div>
                      </a>
                    </li>
                    <li>
                      <a className="dropdown-item border-radius-md" href="javascript:;">
                        <div className="d-flex py-1">
                          <div className="avatar avatar-sm bg-gradient-secondary me-3 my-auto">
                            <svg width="12px" height="12px" viewBox="0 0 43 36" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                              <title>credit-card</title>
                              <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                                <g transform="translate(-2169.000000, -745.000000)" fill="#FFFFFF" fillRule="nonzero">
                                  <g transform="translate(1716.000000, 291.000000)">
                                    <g transform="translate(453.000000, 454.000000)">
                                      <path className="color-background" d="M43,10.7482083 L43,3.58333333 C43,1.60354167 41.3964583,0 39.4166667,0 L3.58333333,0 C1.60354167,0 0,1.60354167 0,3.58333333 L0,10.7482083 L43,10.7482083 Z" opacity="0.593633743"></path>
                                      <path className="color-background" d="M0,16.125 L0,32.25 C0,34.2297917 1.60354167,35.8333333 3.58333333,35.8333333 L39.4166667,35.8333333 C41.3964583,35.8333333 43,34.2297917 43,32.25 L43,16.125 L0,16.125 Z M19.7083333,26.875 L7.16666667,26.875 L7.16666667,23.2916667 L19.7083333,23.2916667 L19.7083333,26.875 Z M35.8333333,26.875 L28.6666667,26.875 L28.6666667,23.2916667 L35.8333333,23.2916667 L35.8333333,26.875 Z"></path>
                                    </g>
                                  </g>
                                </g>
                              </g>
                            </svg>
                          </div>
                          <div className="d-flex flex-column justify-content-center">
                            <h6 className="text-sm font-weight-normal mb-1">
                              Payment successfully completed
                            </h6>
                            <p className="text-xs text-secondary mb-0">
                              <i className="fa fa-clock me-1"></i>
                              2 days
                            </p>
                          </div>
                        </div>
                      </a>
                    </li>
                  </ul>
                </li>
                <li className="nav-item d-flex align-items-center">
                  <a href="/signin" className="nav-link text-body font-weight-bold px-0">
                    <i className="material-symbols-rounded">account_circle</i>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </nav>
        {/* End Navbar */}

        {/* --- Actual Dashboard Content (container for cards) --- */}
        <div className="container-fluid py-2">
          <div className="row"> {/* This row will contain your KPI cards */}
            <div className="col-lg-3 col-md-6 mb-4">
              <div className="card h-100"> {/* Re-using template's 'card' class */}
                <div className="card-body p-3">
                  <div className="row">
                    <div className="col-8">
                      <div className="numbers">
                        <p className="text-sm mb-0 text-capitalize font-weight-bold">{kpiData.money.label}</p>
                        <h5 className="font-weight-bolder mb-0">
                          {kpiData.money.value}
                          <span className={`text-sm font-weight-bolder ms-2 ${getChangeClass(kpiData.money.change)}`}>
                            {kpiData.money.change}
                          </span>
                        </h5>
                      </div>
                    </div>
                    <div className="col-4 text-end">
                      <div className="icon icon-shape bg-gradient-primary shadow text-center border-radius-md">
                        {kpiData.money.icon}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-3 col-md-6 mb-4">
              <div className="card h-100">
                <div className="card-body p-3">
                  <div className="row">
                    <div className="col-8">
                      <div className="numbers">
                        <p className="text-sm mb-0 text-capitalize font-weight-bold">{kpiData.users.label}</p>
                        <h5 className="font-weight-bolder mb-0">
                          {kpiData.users.value}
                          <span className={`text-sm font-weight-bolder ms-2 ${getChangeClass(kpiData.users.change)}`}>
                            {kpiData.users.change}
                          </span>
                        </h5>
                      </div>
                    </div>
                    <div className="col-4 text-end">
                      <div className="icon icon-shape bg-gradient-danger shadow text-center border-radius-md">
                        {kpiData.users.icon}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-3 col-md-6 mb-4">
              <div className="card h-100">
                <div className="card-body p-3">
                  <div className="row">
                    <div className="col-8">
                      <div className="numbers">
                        <p className="text-sm mb-0 text-capitalize font-weight-bold">{kpiData.adsViews.label}</p>
                        <h5 className="font-weight-bolder mb-0">
                          {kpiData.adsViews.value}
                          <span className={`text-sm font-weight-bolder ms-2 ${getChangeClass(kpiData.adsViews.change)}`}>
                            {kpiData.adsViews.change}
                          </span>
                        </h5>
                      </div>
                    </div>
                    <div className="col-4 text-end">
                      <div className="icon icon-shape bg-gradient-success shadow text-center border-radius-md">
                        {kpiData.adsViews.icon}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-3 col-md-6 mb-4">
              <div className="card h-100">
                <div className="card-body p-3">
                  <div className="row">
                    <div className="col-8">
                      <div className="numbers">
                        <p className="text-sm mb-0 text-capitalize font-weight-bold">{kpiData.sales.label}</p>
                        <h5 className="font-weight-bolder mb-0">
                          {kpiData.sales.value}
                          <span className={`text-sm font-weight-bolder ms-2 ${getChangeClass(kpiData.sales.change)}`}>
                            {kpiData.sales.change}
                          </span>
                        </h5>
                      </div>
                    </div>
                    <div className="col-4 text-end">
                      <div className="icon icon-shape bg-gradient-info shadow text-center border-radius-md">
                        {kpiData.sales.icon}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div> {/* End of KPI cards row */}


          <div className="row mt-4"> {/* Row for Chart Cards */}
            <div className="col-lg-4 mb-4"> {/* First chart card (Website Views) */}
              <div className="card z-index-2">
                <div className="card-header pb-0 bg-transparent">
                  <h6 className="mb-0">Responses by Education Level</h6>
                  <p className="text-sm mb-0">
                    <i className="fa fa-arrow-up text-success"></i>
                    <span className="font-weight-bold">4% more</span> in 2024
                  </p>
                </div>
                <div className="card-body p-3">
                  <div className="chart">
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={educationChartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" interval={0} angle={-30} textAnchor="end" height={60} />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="Responses" fill="#4ade80" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-4 mb-4"> {/* Second chart card (Daily Sales) */}
              <div className="card z-index-2">
                <div className="card-header pb-0 bg-transparent">
                  <h6 className="mb-0">Responses Over Time</h6>
                  <p className="text-sm mb-0">
                    <i className="fa fa-arrow-up text-success"></i>
                    <span className="font-weight-bold"> (+15%) increase</span> in total responses.
                  </p>
                </div>
                <div className="card-body p-3">
                  <div className="chart">
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={responsesOverTimeData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="Daily Responses" stroke="#22c55e" activeDot={{ r: 8 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-4 mb-4"> {/* Third chart card (Completed Tasks) */}
              <div className="card z-index-2">
                <div className="card-header pb-0 bg-transparent">
                  <h6 className="mb-0">Discrimination Reduction Impact</h6>
                  <p className="text-sm mb-0">
                    <i className="fa fa-clock me-1"></i>
                    just updated
                  </p>
                </div>
                <div className="card-body p-3">
                  <div className="chart">
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={discriminationChartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="Count" fill="#4ade80" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          </div> {/* End of Chart cards row */}

          <div className="row mt-4"> {/* Row for Projects and Orders */}
            <div className="col-lg-6 mb-4"> {/* Projects Card */}
              <div className="card h-100">
                <div className="card-header pb-0 p-3">
                  <div className="row">
                    <div className="col-6 d-flex align-items-center">
                      <h6 className="mb-0">Recent Participants</h6>
                    </div>
                  </div>
                </div>
                <div className="card-body p-3 pb-0">
                  <div className="table-responsive">
                    <table className="table align-items-center mb-0">
                      <thead>
                        <tr>
                          <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Participant</th>
                          <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">Details</th>
                          <th className="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Info</th>
                          <th className="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentProjects.length > 0 ? (
                          recentProjects.map((project, index) => (
                            <tr key={index}>
                              <td>
                                <div className="d-flex px-2 py-1">
                                  <div className="d-flex flex-column justify-content-center">
                                    <h6 className="mb-0 text-sm">{project.company}</h6>
                                  </div>
                                </div>
                              </td>
                              <td>
                                <p className="text-xs font-weight-bold mb-0">{project.members}</p>
                              </td>
                              <td className="align-middle text-center text-sm">
                                <span className="text-xs font-weight-bold">{project.budget}</span>
                              </td>
                              <td className="align-middle text-center">
                                <span className={`badge badge-sm ${project.completion === 'Completed' ? 'bg-gradient-success' : 'bg-gradient-warning'}`}>
                                  {project.completion}
                                </span>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="4" className="text-center">No recent participants to display.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-6 mb-4"> {/* Orders Overview Card */}
              <div className="card h-100">
                <div className="card-header pb-0 p-3">
                  <div className="row">
                    <div className="col-6 d-flex align-items-center">
                      <h6 className="mb-0">Overview of Benefits</h6>
                    </div>
                    <div className="col-6 text-end">
                      <button className="btn btn-link text-dark p-0 fixed-plugin-button-nav">
                        <i className="material-symbols-rounded">settings</i>
                      </button>
                    </div>
                  </div>
                </div>
                <div className="card-body p-3">
                  <ul className="list-group">
                    {ordersOverviewData.map((order, index) => (
                      <li key={index} className="list-group-item border-0 d-flex justify-content-between ps-0 mb-2 border-radius-lg">
                        <div className="d-flex align-items-center">
                          <button className={`btn btn-icon-only btn-rounded btn-sm text-center mb-0 me-3 p-3 shadow ${order.status === 'success' ? 'bg-gradient-success' : 'bg-gradient-warning'}`}>
                            <i className="material-symbols-rounded text-white opacity-10">{order.status === 'success' ? 'done' : 'schedule'}</i>
                          </button>
                          <div className="d-flex flex-column">
                            <h6 className="mb-1 text-dark text-sm">{order.title}</h6>
                            <span className="text-xs">{order.time}</span> {/* Assuming time from dummy data */}
                          </div>
                        </div>
                        <div className="d-flex align-items-center text-dark text-gradient text-sm font-weight-bold">
                          {order.value}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div> {/* End of Projects/Orders row */}

          {/* Footer (from template) */}
          <footer className="footer py-4 w-100">
            <div className="container-fluid">
              <div className="row align-items-center justify-content-lg-between">
                <div className="col-lg-6 mb-lg-0 mb-4">
                  <div className="copyright text-center text-sm text-muted text-lg-start">
                    © <script>document.write(new Date().getFullYear())</script>,
                    made with <i className="fa fa-heart"></i> by
                    <a href="https://www.creative-tim.com" className="font-weight-bold" target="_blank" rel="noreferrer">Creative Tim</a>
                    for a better web.
                  </div>
                </div>
                <div className="col-lg-6">
                  <ul className="nav nav-footer justify-content-center justify-content-lg-end">
                    <li className="nav-item">
                      <a href="https://www.creative-tim.com" className="nav-link text-muted" target="_blank" rel="noreferrer">Creative Tim</a>
                    </li>
                    <li className="nav-item">
                      <a href="https://www.creative-tim.com/presentation" className="nav-link text-muted" target="_blank" rel="noreferrer">About Us</a>
                    </li>
                    <li className="nav-item">
                      <a href="https://www.creative-tim.com/blog" className="nav-link text-muted" target="_blank" rel="noreferrer">Blog</a>
                    </li>
                    <li className="nav-item">
                      <a href="https://www.creative-tim.com/license" className="nav-link pe-0 text-muted" target="_blank" rel="noreferrer">License</a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </footer>
        </div> {/* End of container-fluid py-2 */}
      </main>

      {/* Fixed Plugin (Settings sidebar) */}
      <div className="fixed-plugin">
        <a className="fixed-plugin-button text-dark position-fixed px-3 py-2">
          <i className="material-symbols-rounded py-2">settings</i>
        </a>
        <div className="card shadow-lg">
          <div className="card-header pb-0 pt-3">
            <div className="float-start">
              <h5 className="mt-3 mb-0">Material UI Configurator</h5>
              <p>See our dashboard options.</p>
            </div>
            <div className="float-end mt-4">
              <button className="btn btn-link text-dark p-0 fixed-plugin-close-button">
                <i className="material-symbols-rounded">clear</i>
              </button>
            </div>
          </div>
          <hr className="horizontal dark my-1" />
          <div className="card-body pt-sm-3 pt-0">
            <div>
              <h6 className="mb-0">Sidebar Colors</h6>
            </div>
            <a href="javascript:void(0)" className="switch-trigger background-color">
              <div className="badge-colors my-2 text-start">
                <span className="badge filter bg-gradient-primary" data-color="primary" /*onclick="sidebarColor(this)"*/></span>
                <span className="badge filter bg-gradient-dark active" data-color="dark" /*onclick="sidebarColor(this)"*/></span>
                <span className="badge filter bg-gradient-info" data-color="info" /*onclick="sidebarColor(this)"*/></span>
                <span className="badge filter bg-gradient-success" data-color="success" /*onclick="sidebarColor(this)"*/></span>
                <span className="badge filter bg-gradient-warning" data-color="warning" /*onclick="sidebarColor(this)"*/></span>
                <span className="badge filter bg-gradient-danger" data-color="danger" /*onclick="sidebarColor(this)"*/></span>
              </div>
            </a>
            <div className="mt-3">
              <h6 className="mb-0">Sidenav Type</h6>
              <p className="text-sm">Choose between different sidenav types.</p>
            </div>
            <div className="d-flex">
              <button className="btn bg-gradient-dark px-3 mb-2" data-class="bg-gradient-dark" /*onclick="sidebarType(this)"*/>Dark</button>
              <button className="btn bg-gradient-dark px-3 mb-2 ms-2" data-class="bg-transparent" /*onclick="sidebarType(this)"*/>Transparent</button>
              <button className="btn bg-gradient-dark px-3 mb-2 active ms-2" data-class="bg-white" /*onclick="sidebarType(this)"*/>White</button>
            </div>
            <p className="text-sm d-xl-none d-block mt-2">You can change the sidenav type just on desktop view.</p>
            <div className="mt-3 d-flex">
              <h6 className="mb-0">Navbar Fixed</h6>
              <div className="form-check form-switch ps-0 ms-auto my-auto">
                <input className="form-check-input mt-1 ms-auto" type="checkbox" id="navbarFixed" /*onclick="navbarFixed(this)"*/ />
              </div>
            </div>
            <hr className="horizontal dark my-3" />
            <div className="mt-2 d-flex">
              <h6 className="mb-0">Light / Dark</h6>
              <div className="form-check form-switch ps-0 ms-auto my-auto">
                <input className="form-check-input mt-1 ms-auto" type="checkbox" id="dark-version" /*onclick="darkMode(this)"*/ />
              </div>
            </div>
            <hr className="horizontal dark my-sm-4" />
            <a className="btn bg-gradient-info w-100" href="https://www.creative-tim.com/product/material-dashboard-pro" target="_blank" rel="noreferrer">Free Download</a>
            <a className="btn btn-outline-dark w-100" href="https://www.creative-tim.com/learning-lab/bootstrap/overview/material-dashboard" target="_blank" rel="noreferrer">View documentation</a>
            <div className="w-100 text-center">
              <a className="github-button" href="https://github.com/creativetimofficial/material-dashboard" data-icon="octicon-star" data-size="large" data-show-count="true" aria-label="Star creativetimofficial/material-dashboard on GitHub">Star</a>
              <h6 className="mt-3">Thank you for sharing!</h6>
              <a href="https://twitter.com/intent/tweet?text=Check%20Material%20UI%20Dashboard%20made%20by%20%40CreativeTim%20%23webdesign%20%23dashboard%20%23bootstrap5&amp;url=https%3A%2F%2Fwww.creative-tim.com%2Fproduct%2Fsoft-ui-dashboard" className="btn btn-dark mb-0 me-2" target="_blank" rel="noreferrer">
                <i className="fab fa-twitter me-1" aria-hidden="true"></i> Tweet
              </a>
              <a href="https://www.facebook.com/sharer/sharer.php?u=https://www.creative-tim.com/product/material-dashboard" className="btn btn-dark mb-0 me-2" target="_blank" rel="noreferrer">
                <i className="fab fa-facebook-square me-1" aria-hidden="true"></i> Share
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;