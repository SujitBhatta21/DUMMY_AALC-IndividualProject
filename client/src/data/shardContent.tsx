import "../App.css"
import GlossaryTerm from "../components/GlossaryTerm.tsx";
import type {ReactNode} from "react";


const shardContent: Record<number, ReactNode> = {
    1: (
        <div>
            <p>
                <strong><GlossaryTerm word="Apartheid" /></strong> is a system of racial segregation and control.
                The word apartheid means <strong>'separateness'</strong>.
            </p>
            <p>
                In the 17th Century, Dutch settlers arrived in South Africa,
                followed by the British in the 18th Century.
            </p>
            <p>
                Colonial rivals, they stole the land and took away rights
                from the people who already lived there.
            </p>
            <p>
                The <strong><GlossaryTerm word="National Party" /></strong>, a white minority political party, began to put
                'Apartheid' laws in place after they took power in <strong>1948</strong> following
                an election in which only white people could vote. These laws controlled where
                black South Africans could live, work, and move.
                The ANC (African National Congress) was one of the main organisations that resisted apartheid.
            </p>
        </div>
    ),
    2: (
        <div>
            <p>
                Under apartheid, the government banned all forms of protest.
                The <strong><GlossaryTerm word="Terrorism Act" /></strong> meant anyone who spoke out could be
                sentenced to long prison terms on <strong><GlossaryTerm word="Robben Island" /></strong> - or
                detained <strong>indefinitely without trial</strong>.
            </p>
            <p>
                Strikes by black workers were illegal. Even gathering in groups could lead to arrest.
            </p>
            <p>
                But none of this stopped the resistance. People organised in secret,
                forming underground networks to <strong><GlossaryTerm word="sabotage" /></strong> power stations,
                and smuggle activists out of the country to join banned <strong><GlossaryTerm word="liberation movements" /></strong> -
                some of which operated from right here in London.
            </p>
        </div>
    ),
    3: (
        <div>
            <p>
                Apartheid sparked growing resistance - especially among young people.
                In <strong>March, 1960</strong>, police opened fire on peaceful protesters
                in <strong><GlossaryTerm word="Sharpeville" /></strong>, killing 69 people, including women and children.
            </p>
            <p>
                In <strong>June, 1976</strong>, students in <strong><GlossaryTerm word="Soweto" /></strong> rose up
                against forced <strong><GlossaryTerm word="Afrikaans" /></strong>-language instruction. Police responded with
                bullets. These moments shook the world when images taken by
                photographers on the ground were shared internationally.
            </p>
        </div>
    ),
    4: (
        <div>
            <p>
                As news of apartheid spread, people outside South Africa began to take action.
                In the UK, students, faith groups, <strong><GlossaryTerm word="trade unions" /></strong>, and political activists organised
                protests to show <strong><GlossaryTerm word="solidarity" /></strong>.
            </p>
            <p>
                Young people played a big role.
            </p>
            <p>
                Student groups across the country joined campaigns such as the <strong><GlossaryTerm word="Barclays boycott" /></strong>, encouraging people
                to close their bank accounts because Barclays invested in apartheid South Africa.
            </p>
            <p>
                Leaflets, rallies, marches, <strong><GlossaryTerm word="boycotts" /></strong>, and campus marches helped spread awareness and put pressure on
                companies and the UK government to take a stand.
            </p>
        </div>
    ),
    5: (
        <div>
            <p>
                The ANC in <strong><GlossaryTerm word="exile" /></strong> set up its London office at <strong>28 Penton Street.</strong>
            </p>
            <p>
                This small building became a lifeline for the struggle:
            </p>
            <p>  - editing and printing newsletters </p>
            <p>- storing secret documents</p>
            <p>- working with <strong><GlossaryTerm word="Anti-Apartheid Movement" /></strong> to coordinate protests</p>
            <p>- meeting supporters and supporting members of the exiled Southern African communities.</p>
        </div>
    ),
    6: (
        <div>
            <p>
                On 14th March 1982, 9 apartheid agents planted a bomb at 28 Penton Street. On that day
                they expected ANC leader <strong><GlossaryTerm word="Oliver Tambo" /></strong> to be in the building.
            </p>
            <p>
                Their aim: destroy documents, silence voices, <strong><GlossaryTerm word="assassinate" /></strong> Tambo and intimidate activists.
            </p>
            <p>
                Miraculously, no one was killed.
            </p>
        </div>
    ),
    7: (
        <div>
            <p>
                As the struggle against apartheid grew, people around the world called for <strong><GlossaryTerm word="sanctions" /></strong>
                - actions that put economic and political pressure on the South African government.
            </p>
            <p>
                But not all governments agreed.
            </p>
            <p>
                In the UK, the government at the time did <strong>not</strong> support full sanctions against apartheid.
                So ordinary people, community groups, <strong><GlossaryTerm word="trade unions" /></strong>, artists, and activists took the lead.
            </p>
            <p>
                They organised <strong><GlossaryTerm word="boycotts" /></strong> of South African goods, refused to play or perform in South Africa,
                boycotted visiting South African sports teams, and pushed companies to stop trading
                with the apartheid <strong><GlossaryTerm word="regime" /></strong>. Even local councils also refused to invest their pension funds in apartheid South Africa.
            </p>
            <p>
                These actions didn't end apartheid on their own - but they made the South African government
                more <strong>isolated</strong> and helped show the world's growing refusal to accept <strong>injustice</strong>.
            </p>
        </div>
    ),
    8: (
        <div>
            <p>When you couldn't speak freely, you could still sing.</p>
            <p>
                Music was one of apartheid's most powerful opponents. At marches, uprisings, and community gatherings,
                songs carried messages of hope, <strong><GlossaryTerm word="defiance" /></strong>, and solidarity that no law could silence.
            </p>
            <p>
                Struggle songs like <strong><em><GlossaryTerm word="Senzeni Na?" /></em></strong>, <strong><em><GlossaryTerm word="Siyahamba" /></em></strong>,
                and <strong><em><GlossaryTerm word="Nkosi Sikelel' iAfrika" /></em></strong> kept people united - some were calming,
                some were bold, and some openly mocked the apartheid government.
            </p>
            <p>
                These songs didn't stay in South Africa. Recordings spread across the world, and in the UK, choirs,
                student groups, and artists performed their own versions. <strong><em>"Free Nelson Mandela" </em></strong>
                became an international anthem - and a massive concert at Wembley calling for his release was
                broadcast to millions worldwide.
            </p>
            <p>Music crossed borders that people couldn't. It kept the movement alive.</p>
        </div>
    ),
    9: (
        <div>
            <p>In 1955, people from across South Africa - workers, students, and activists - came together to imagine a fair and equal country. Their ideas became the <strong><GlossaryTerm word="Freedom Charter" /></strong>.</p>
            <p>The Charter declared principles that the apartheid government considered dangerous:</p>
            <ul className="charter-list">
                <li><em>"South Africa belongs to all who live in it."</em></li>
                <li>All people should have equal rights, regardless of race.</li>
                <li>Everyone should be free to learn, work, vote, and move freely.</li>
                <li>The law should protect all people equally.</li>
            </ul>
            <p></p>
            <p><br></br>The Charter was banned. But it couldn't be silenced.</p>
            <p>
                Nearly forty years later, when apartheid finally ended in the 1990s, the Freedom Charter's principles
                helped shape South Africa's new <strong><GlossaryTerm word="Constitution" /></strong> - one of the most progressive in the world.
                The dreams of 1955 became legal rights for everyone.
            </p>
        </div>
    ),
};

export default shardContent;
