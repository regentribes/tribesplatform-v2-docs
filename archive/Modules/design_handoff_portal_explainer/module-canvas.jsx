/* MyCoNet — design canvas wiring */

const ARTBOARD_W = 1280;
const ARTBOARD_H = 860;

function ModuleArtboard({ children }) {
  // Force a fixed pixel size and prevent the inner app from overflowing.
  return (
    <div style={{
      width: ARTBOARD_W, height: ARTBOARD_H,
      background: 'var(--bg)', overflow: 'hidden',
    }}>
      {children}
    </div>
  );
}

function Layouts() {
  return (
    <DesignCanvas>
      <DCSection id="clubhouse" title="Clubhouse — open to every member" subtitle="What an Explorer sees after signing in. These four are unlocked from day one.">
        <DCArtboard id="m00" label="M00 · Dashboard" width={ARTBOARD_W} height={ARTBOARD_H}>
          <ModuleArtboard><M00Dashboard/></ModuleArtboard>
        </DCArtboard>
        <DCArtboard id="m01" label="M01 · Community Network" width={ARTBOARD_W} height={ARTBOARD_H}>
          <ModuleArtboard><M01Network/></ModuleArtboard>
        </DCArtboard>
        <DCArtboard id="m04" label="M04 · Blueprint wizard" width={ARTBOARD_W} height={ARTBOARD_H}>
          <ModuleArtboard><M04Blueprint/></ModuleArtboard>
        </DCArtboard>
        <DCArtboard id="m05" label="M05 · Join (values & best practice)" width={ARTBOARD_W} height={ARTBOARD_H}>
          <ModuleArtboard><M05Join/></ModuleArtboard>
        </DCArtboard>
      </DCSection>

      <DCSection id="resident" title="Resident-only modules" subtitle="Unlocked once an Explorer signs the values and becomes a Joining/Resident member.">
        <DCArtboard id="m06" label="M06 · Agreements" width={ARTBOARD_W} height={ARTBOARD_H}>
          <ModuleArtboard><M06Agreements/></ModuleArtboard>
        </DCArtboard>
        <DCArtboard id="m07" label="M07 · Operations" width={ARTBOARD_W} height={ARTBOARD_H}>
          <ModuleArtboard><M07Operations/></ModuleArtboard>
        </DCArtboard>
        <DCArtboard id="m08" label="M08 · Contribution Tracking" width={ARTBOARD_W} height={ARTBOARD_H}>
          <ModuleArtboard><M08Contributions/></ModuleArtboard>
        </DCArtboard>
        <DCArtboard id="m09" label="M09 · Governance (4 layers)" width={ARTBOARD_W} height={ARTBOARD_H}>
          <ModuleArtboard><M09Governance/></ModuleArtboard>
        </DCArtboard>
      </DCSection>
    </DesignCanvas>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<Layouts/>);
