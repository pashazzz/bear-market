import './Header.css'

function Header() {
  return (
    <div className='header-container'>
      <div className='header'>
        <a href='/' className='header-logo'>
          <img src='/logo.png' alt="Logo"/>
        </a>
        <input type="text" className='header-search' placeholder='Search'/>
        <div className='header-login-container'>
          <span className='header-login'>Log in</span> / <span className='header-register'>Register</span>
        </div>
      </div>
    </div>
  )
}

export default Header