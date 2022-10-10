import { FunctionComponent } from 'react';
import { Container, SimpleGrid, Text, Heading, IconButton, Box } from '@chakra-ui/react';
import { CopyIcon } from '@chakra-ui/icons';
import Image from 'next/image';

import CodeTwoImage from '@assets/images/code2.png';

const CODE_TEXT = `curl --proto '=https' --tlsv1.2 -sSf https://raw.githubusercontent.com/build-trust/ockam/develop/install.sh | sh

ockam node create relay

# -- APPLICATION SERVICE --

python3 -m http.server --bind 127.0.0.1 5000

ockam node create server_sidecar
ockam tcp-outlet create --at /node/server_sidecar --from /service/outlet --to 127.0.0.1:5000
ockam forwarder create server_sidecar --at /node/relay --to /node/server_sidecar

# -- APPLICATION CLIENT --

ockam node create client_sidecar
ockam secure-channel create --from /node/client_sidecar --to /node/relay/service/forward_to_server_sidecar/service/api \\
    | ockam tcp-inlet create --at /node/client_sidecar --from 127.0.0.1:7000 --to -/service/outlet

curl --head 127.0.0.1:7000`;

const TEXTS = [
  [
    'To be private and secure by-design, applications must have granular control over every trust and access decision. This requires a variety of complex cryptographic and messaging protocols that must work together securely and at scale.',
    'Application developers have to think about creating unique cryptographic keys and issuing credentials to all application entities. Design ways to safely store secrets in hardware. Securely distribute roots of trust. Safely rotate and revoke credentials. Setup channels that gaurantee data integrity and authenticty. Control and enforce authorization decisions etc.',
  ],
  [
    'All of this gets very complicated, very quickly.',
    'At Ockam, our mission is to empower every developer with simple tools so they can create applications that Trust Data-in-Motion.',
    'We have taken proven cryptographic protocols and made them easy to use on the command line or call from within your code as a programming library. We handle all the underlying complexity and give you high-level and composable building blocks to create end-to-end, application layer trust.',
    'Here is one example of this in action …'
  ],
];


const copyToClipboard = (): void => {
  if (typeof navigator !== 'undefined') navigator.clipboard.writeText(CODE_TEXT);
};

const Tools: FunctionComponent = () => (
  <Container variant="section" pt={{ base: 16, lg: 24 }} pb={{ base: 20, lg: 30 }}>
    <Heading as="h2" size="h2" bgColor="white" mb={{ base: 12, lg: 16 }}>
      Powerful Protocols, Made Simple
    </Heading>

    <SimpleGrid columns={{ base: 1, lg: 2 }} spacingX={16} mb={{ base: 20, lg: 16 }}>
      {TEXTS.map((column) => (
        <Box key={`${column[1]}column`} _notLast={{ mb: { base: 5, lg: 0 } }}>
          {column.map((text) => (
            <Text key={text} fontSize={{ lg: 'lg' }} _notLast={{ mb: { base: 5, lg: 4 } }}>
              {text}
            </Text>
          ))}
        </Box>
      ))}
    </SimpleGrid>

    <Box
      position="relative"
      _hover={{ button: { display: 'block' } }}
      zIndex={0}
      p={0}
      sx={{
        span: {
          boxShadow: 'xl',
        },
      }}
    >
      <IconButton
        aria-label="Copy code to clipboard"
        colorScheme="avocado"
        bgColor="brand.800"
        _hover={{ bgColor: 'brand.900' }}
        size="sm"
        icon={<CopyIcon />}
        display="none"
        position="absolute"
        top="9%"
        right="4%"
        zIndex={1}
        onClick={copyToClipboard}
      />

      <Image
        src={CodeTwoImage}
        width={2080 / 2}
        height={1301 / 2}
        alt="Code block 2"
        placeholder="blur"
        priority
      />
    </Box>
  </Container>
);

export default Tools;
