import {Box, Button, ChakraProvider, Input, useDisclosure} from "@chakra-ui/react";
import theme from "./theme";
import Layout from "./components/Layout";
import ConnectButton from "./components/ConnectButton";
import AccountModal from "./components/AccountModal";
import "@fontsource/inter";
import {useEthers} from "@usedapp/core";
import {useState} from "react";

function App() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { account, library } = useEthers();
  const [message, setMessage] = useState<string>('');
  const [signedMessage, setSignedMessage] = useState<string>('');

  const signMessage = () => {
    library?.getSigner(account as string).signMessage(message).then((result) => {
      console.log(result);
      setSignedMessage(result);
    })
  }

  return (
    <ChakraProvider theme={theme}>
      <Layout>
        <ConnectButton handleOpenModal={onOpen} />
        <AccountModal isOpen={isOpen} onClose={onClose} />
        {account && (
          <>
            <Input
              style={{
                width: 500,
                color: 'white',
                marginTop: 100,
              }}
              value={message}
              placeholder="Basic usage"
              onChange={(ev) => setMessage(ev.target.value)}
            />
            <Button onClick={signMessage}>Sign message</Button>
          </>
        )}
        {signedMessage && (
          <Box style={{marginTop:20}} bg="tomato" w="600px" p={4} color="white">
            { signedMessage }
          </Box>
        )}
      </Layout>
    </ChakraProvider>
  );
}

export default App;
