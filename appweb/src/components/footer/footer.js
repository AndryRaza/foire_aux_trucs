import React from "react";
import "./footer.css"

import { Button } from "react-bootstrap";

const FooterComponent = () => {

    return (
        <footer>
            <Button className="mx-1" variant="danger">Annuler</Button>
            <Button className="mx-6" variant="success">Valider la page</Button>
        </footer>
    )

}

export default FooterComponent