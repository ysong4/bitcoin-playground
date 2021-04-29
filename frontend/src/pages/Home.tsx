import { Collapse, Layout } from "antd";
import styled from "styled-components";
import GenerateSeed from "../components/GenerateSeed";
import GenerateHDSegWitAddress from "../components/GenerateHDSegWitAddress";
import GenerateMultiSigP2SHAddress from "../components/GenerateMultiSigP2SHAddress";

const { Header, Footer, Content } = Layout;
const {Panel} = Collapse;

const Home: React.VFC = () => {
  return (
    <Layout>
      <Header>
        <StyledTitle>Bitcoin Playground</StyledTitle>
      </Header>
      <StyledContent>
        <Collapse>
          <Panel header="Generate Seed" key="Seed">
            <GenerateSeed />
          </Panel>
          <Panel header="Generate HD SegWit Bitcoin Address" key="HDSegWit">
            <GenerateHDSegWitAddress />
          </Panel>
          <Panel header="Generate n-out-of-m Multisignature P2SH Bitcoin Address" key="MultiSigP2SH">
            <GenerateMultiSigP2SHAddress />
          </Panel>
        </Collapse>
      </StyledContent>
      <Footer>Written by ysong4</Footer>
    </Layout>
  );
};

export default Home;

const StyledTitle = styled.h1`
  color: #ffffff;
`;

const StyledContent = styled(Content)`
  padding: 50px;
`;