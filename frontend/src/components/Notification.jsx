const Notification = ({ message, isError }) => {
  if (message === null) {
    return null
  }

  return (
    <div className={`alert-box ${isError ? 'error' : 'success'}`}>
      {message}
    </div>
  )
}

export default Notification
