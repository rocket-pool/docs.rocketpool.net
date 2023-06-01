import { nextTick, Ref } from 'vue'

type StabiliseScrollPosition = <Args extends readonly unknown[], Return>(
    func: (...args: Args) => Return
) => (...args: Args) => Promise<Return>

export const useStabiliseScrollPosition = (
    targetEle: Ref<HTMLElement | undefined>
) => {
    if (typeof document === 'undefined') {
        const mock: StabiliseScrollPosition =
            f =>
                async (...args) =>
                    f(...args)
        return { stabiliseScrollPosition: mock }
    }

    const scrollableEleVal = document.documentElement

    const stabiliseScrollPosition: StabiliseScrollPosition =
        func =>
            async (...args) => {
                const result = func(...args)
                const eleVal = targetEle.value
                if (!eleVal) return result

                const offset = eleVal.offsetTop - scrollableEleVal.scrollTop
                await nextTick()
                scrollableEleVal.scrollTop = eleVal.offsetTop - offset

                return result
            }

    return { stabiliseScrollPosition }
}