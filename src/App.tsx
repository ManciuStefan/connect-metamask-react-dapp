import {Box, Button, ChakraProvider, useDisclosure, Textarea, Input} from "@chakra-ui/react";
import theme from "./theme";
import Layout from "./components/Layout";
import ConnectButton from "./components/ConnectButton";
import AccountModal from "./components/AccountModal";
import "@fontsource/inter";
import {useEthers} from "@usedapp/core";
import {useState} from "react";
import Web3Token from 'web3-token';

function App() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { account, library } = useEthers();
  const [message, setMessage] = useState<string>('');
  const [signedMessage, setSignedMessage] = useState<string>('');
  const [signedWeb3token, setSignedWeb3token] = useState<string>('');

  const [domain, setDomain] = useState<string>('');
  const [expiresIn, setExpiresIn] = useState<string>('');


  const signMessage = async () => {
    if (!library) {
      console.log("No library");
      return;
    }
    const signer = library.getSigner(account as string);
    signer.signMessage(message).then((result) => {
      console.log(result);
      setSignedMessage(result);
    })
  }

  const getWeb3Token = async() => {
    if (!library) {
      console.log("No library");
      return;
    }
    const signer = library.getSigner(account as string);

    const token = await Web3Token.sign(async (msg: string) => await signer.signMessage(msg), {
      domain: domain,
      expires_in: expiresIn
    });

    setSignedWeb3token(token)
  }

  return (
    <ChakraProvider theme={theme}>
      <Layout>
        <ConnectButton handleOpenModal={onOpen} />
        <AccountModal isOpen={isOpen} onClose={onClose} />
        {account && (
          <>
            <Textarea
              style={{
                width: 500,
                color: 'white',
                marginTop: 100,
              }}
              value={message}
              placeholder="Message to sign"
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

        {account && (
            <>
              <Input
                  style={{
                    width: 500,
                    color: 'white',
                    marginTop: 100,
                  }}
                  value={domain}
                  placeholder="Web3token domain"
                  onChange={(ev) => setDomain(ev.target.value)}
              />
              <Input
                  style={{
                    width: 500,
                    color: 'white',
                  }}
                  value={expiresIn}
                  placeholder="Web3token expiration"
                  onChange={(ev) => setExpiresIn(ev.target.value)}
              />
              <Button onClick={getWeb3Token}>Get Web3token</Button>
            </>
        )}

        {signedWeb3token && (
            <Box style={{marginTop:20}} bg="tomato" w="600px" p={4} color="white">
              { signedWeb3token }
            </Box>
        )}
      </Layout>
    </ChakraProvider>
  );
}

export default App;
