class ComponentEvents {
    componentElements = [];

    register(componentElement: HTMLElement) {
        this.componentElements.push(componentElement)
    }

    subscribe(componentName, eventName, subscription) {
        const component: HTMLElement = this.componentElements.find((component) => {
            return component.componentName = componentName;
        });

        component.addEventListener(eventName, subscription);
    }
}

const componentEvents = new ComponentEvents();

export default componentEvents;