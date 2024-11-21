import React from 'react'
interface EnteringProps {
    byRole: any
    yourRole: any
    byId: any
    toRoom: any
}
const Entering: React.FC<EnteringProps> = ({ byRole, toRoom, byId, yourRole }) => {
  function checkBool(){
    if(yourRole == 'User' || byRole == 'User'){
      return false
    } else {
      return true
    }
  }
    return (
        <>
                <div className={`message-container ${checkBool() ? 'justify-end' : 'justify-start'}`}>
                    <div className={`message ${checkBool() ? 'customer' : 'support'}`}>
                        {/* customer là bên mình */}
                        {/* <FontAwesomeIcon icon={faSpinner} className="typing-icon" spin /> */}
                        ....
                    </div>
                </div>
        </>
    )
}

export default Entering
