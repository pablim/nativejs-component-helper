import Component from './Component.js'
import convertCase from '../resources/js/convertCase.js'
export default function defineElement (definition) {
	
	var c = () => class extends Component{
		constructor () {
			super(definition)
        }
        
        static get observedAttributes() {
            let attrNames = []
            
            for (var i in definition.props) {
                attrNames.push(convertCase(i, "camel", "kebab"))
            }
            
            return attrNames
        }
	}

    $.get('/components/'+definition.templateFile, 
        function (data) {
            document.body.innerHTML = data + document.body.innerHTML
            customElements.define(definition.name, c())
        }
    )
}