import history from "../../../history"

const Back = () => {
  return (
    <h3 className="back-button" onClick={history.back}>
      &larr; Back
    </h3>
  )
}

export default Back