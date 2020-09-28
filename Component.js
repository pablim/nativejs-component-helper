import convertCase from '../../resources/js/convertCase.js'

export default class Component extends HTMLElement {
    constructor(definition) {
        super();
        let template = document.getElementById(definition.templateId);
        let templateContent = template.content;

        this.definition = definition
        const shadowRoot = this.attachShadow({ mode: 'open' })
            .appendChild(templateContent.cloneNode(true));
    }

    // when the element is inserted into the DOM
    connectedCallback() {
        var templateBinds = this.definition.templateBinds
        var props = this.definition.props

        if (this.definition.init) 
            this.definition.init(this)

        for (var i in templateBinds) {
            if (templateBinds[i] instanceof Function) {
                // Executa uma função
                templateBinds[i]()
            } else if (templateBinds[i] instanceof Object) {
                // Associa os eventos
                for (var eventName in templateBinds[i]) {
                    var element = this.getElement("#"+i)
                    element[eventName] = templateBinds[i][eventName].bind(this)
                }
            }
            else {
                // Injeta conteúdo
                this.setInnerElement("#"+i, templateBinds[i])
            }
        }

        for (var i in props) {
            let prop = props[i]
            let attrName = convertCase(i, "camel", "kebab")
            if (this.get(attrName) != null) {
                if (prop instanceof Function) {
                    prop(this, this.get(i))
                } else if (prop instanceof Object) {
                    this.setInnerElement("#"+prop.bind, this.get(i))
                    this.setInnerElement("."+prop.bind, this.get(i))
                } 
            }
        }
    }

    // when an observed attribute changed, or is added or removed
    attributeChangedCallback(attrName, oldVal, newVal) {
        var props = this.definition.props
        if (newVal != oldVal) {
            let propName = convertCase(attrName, "kebab", "camel")
            if (this.get(attrName) != null) {
                if (this.definition.props[propName] instanceof Function) {
                    this.definition.props[propName](this, newVal)
                } else if (this.definition.props[propName] instanceof Object) {
                    //this.setInnerElement("#"+newVal.bind, this.get(attrName))
                    this.setInnerElement("#"+props[attrName].bind, newVal)
                } 
            }
        }
    }

    // when the element is removed from the DOM
    disconnectedCallback() {
        console.log("removido")
    }

    // when the element has been moved to a new document
    adoptedCallback() {
        console.log("movido")
    }

    getElement(elementReference) {
        return this.shadowRoot.querySelector(elementReference)
    }

    getElements(elementReference) {
        return this.shadowRoot.querySelectorAll(elementReference)
    }

    setInnerElement(elementReference, content) {
        let element = this.getElement(elementReference)
        if (element)
            element.innerHTML = content
    }

    get(attr) {
        return this.getAttribute(attr);
    }
    set(attr, value) {
        this.setAttribute(attr, value);
    }
}



