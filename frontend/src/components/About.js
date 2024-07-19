import React from 'react'
import '../styles/About.css'
export default function About() {
  return (
    <div className="aboutContainer">

    <div className="about-page">
      <h1>About Supermarket Automation Software</h1>
      <p>
        Our Supermarket Automation Software is designed to streamline operations
        and enhance efficiency in supermarkets. With features tailored for both
        managers and clerks, our software simplifies inventory management,
        pricing updates, and billing processes.
      </p>
      <h2>Manager Features</h2>
      <ul>
        <li>Add new items to the supermarket inventory</li>
        <li>Add stocks and manage inventory levels</li>
        <li>Update prices of items</li>
        <li>Check statistics and reports for better decision making</li>
      </ul>
      <h2>Clerk Features</h2>
      <ul>
        <li>Efficient billing process</li>
        <li>Easy access to item information</li>
        <li>Quick transaction processing</li>
      </ul>
    </div>
    </div>

  )
}
