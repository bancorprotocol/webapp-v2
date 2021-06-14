

class Action {


    name: string

    constructor(name: string) {
        this.name = name.toUpperCase()
    }

    get trigger() {
        return this.append('trigger');
    }

    get success() {
        return this.append('success')
    }

    get error() {
        return this.append('error')
    }

    private action(name: string, payload?: any) {
        return ({ type: name, ...(payload && ({ payload }))})
    }

    public triggerAction(payload?: any) {
        return this.action(this.trigger, payload)
    }

    public successAction(payload?: any) {
        return this.action(this.success, payload)
    }

    private append(label: string) {
        return `FETCH_${this.name}_${label.toUpperCase()}`
    }

}

export const poolActions = new Action('pools'); 
export const tokenActions = new Action('tokens'); 