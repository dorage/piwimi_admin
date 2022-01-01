import app from './ExpressApp';
import { ENV } from './configs';

const port = ENV.port;

const handleListen = () => {
    console.log(`Listening On : http://localhost:${port}`);
};

app.listen(port, handleListen);
