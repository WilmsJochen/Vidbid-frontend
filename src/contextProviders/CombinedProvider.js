import {Top5VidsProvider} from "./Top5VidsProvider"
import {AllVidsProvider} from "./AllVidsProvider"
import {FavoriteVidsProvider} from "./FavoriteVidsProvider"


export default function CombinedProvider({ children }) {
    return (
        <FavoriteVidsProvider>
            {/*<AllVidsProvider>*/}
                {children}
            {/*</AllVidsProvider>*/}
        </FavoriteVidsProvider>
    );
}