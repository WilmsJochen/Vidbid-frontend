import {Top5VidsProvider} from "./Top5VidsProvider"
import {AllVidsProvider} from "./AllVidsProvider"


export default function CombinedProvider({ children }) {
    return (
        <Top5VidsProvider>
            {/*<AllVidsProvider>*/}
                {children}
            {/*</AllVidsProvider>*/}
        </Top5VidsProvider>
    );
}