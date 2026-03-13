package com.example.server.config;

import com.example.server.model.Role;
import com.example.server.model.Shard;
import com.example.server.model.User;
import com.example.server.repository.ShardRepository;
import com.example.server.repository.UserRepository;
import com.example.server.repository.UserShardProgressRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;

@Component
public class DataSeeder implements CommandLineRunner {

    // set to true to wipe all tables and re-seed on startup.
    // Set back to false for normal operation.
    private static final boolean FORCE_RESEED = false;

    private final ShardRepository shardRepository;
    private final UserRepository userRepository;
    private final UserShardProgressRepository userShardProgressRepository;
    private final PasswordEncoder passwordEncoder;
    private final JdbcTemplate jdbcTemplate;

    public DataSeeder(ShardRepository shardRepository,
                      UserRepository userRepository,
                      UserShardProgressRepository userShardProgressRepository,
                      PasswordEncoder passwordEncoder,
                      JdbcTemplate jdbcTemplate) {
        this.shardRepository = shardRepository;
        this.userRepository = userRepository;
        this.userShardProgressRepository = userShardProgressRepository;
        this.passwordEncoder = passwordEncoder;
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public void run(String... args) {
        if (FORCE_RESEED) {
            // UserShardProgress references both User and Shard — must go first
            userShardProgressRepository.deleteAll();
            userRepository.deleteAll();
            shardRepository.deleteAll();


            // Example of how to execute any sql query if needed.
            // jdbcTemplate.execute("SELECT * FROM shard WHERE shard_id = 1");

            System.out.println("DataSeeder: All tables cleared.");
        } else {
            // Normally this done..
            if (shardRepository.count() > 0) return;
        }

        seedUsers();
        seedShards();
    }

    private void seedUsers() {
        User admin1 = new User();
        admin1.setUsername("AdminSujit");
        admin1.setPassword(passwordEncoder.encode("Admin123"));
        admin1.setRole(Role.ADMIN);

        User admin2 = new User();
        admin2.setUsername("AdminCaroline");
        admin2.setPassword(passwordEncoder.encode("Admin123"));
        admin2.setRole(Role.ADMIN);

        User player = new User();
        player.setUsername("TestPlayer");
        player.setPassword(passwordEncoder.encode("Player123"));
        player.setRole(Role.USER);

        userRepository.saveAll(List.of(admin1, admin2, player));
        System.out.println("DATASEEDER: Users seeded.");
    }

    private void seedShards() {
        shardRepository.saveAll(List.of(
                new Shard(1, "Shard-1: The Passbook Fragment",
                        "The word \u201capartheid\" means ___. The National Party, a white minority political party, took power in ___ after an election in which only ___ people could vote. These laws controlled where black South Africans could live, work, and move. The ___ was one of the organisations that resisted apartheid.",
                        Map.of(1, List.of("separateness", "supremacy"),
                                2, List.of("1948", "1938"),
                                3, List.of("white", "wealthy", "male"),
                                4, List.of("ANC (African National Congress)", "APC (African People's Congress)")),
                        "In 1952, Black South Africans were required to carry passbooks" +
                        " controlling where they could live, work, or travel. These laws turned daily life into a constant threat.",
                        "JIGSAW"),
                new Shard(2, "Shard-2: The Silencing",
                        " The ___ Act meant anyone who spoke out could be sentenced to prison on ___." +
                                " ___ by black workers were illegal.",
                        Map.of(1, List.of("Terrorism", "Elections"),
                                2, List.of("Robben Island", "Johannesburg"),
                                3, List.of("Strikes", "Freedom", "Treason")),
                        "The government aimed to silence resistance with Imprisonment and bannings " +
                                "– but South Africans continued to organise underground and to smuggle people " +
                                "out to continue the struggle from outside the country. Resistance found a way.",
                        "REDACTED_REVEAL"),
                new Shard(3, "Shard-3: The Uprising ",
                        "In ___, police opened fire on peaceful protesters in ___, killing at least ___ people including children." +
                                " In 1976, students in ___ rose up against forced ___-language instruction.",
                        Map.of(1, List.of("1960", "1948", "Joannesburg", "45", "Cape Town", "English"),
                                2, List.of("Sharpeville"),
                                3, List.of("69"),
                                4, List.of("Soweto"),
                                5, List.of("Afrikaans")),
                        "From Sharpeville to Soweto, uprisings revealed the courage of ordinary people — and the cruelty of the state.\n" +
                                "These events lit a spark that spread around the world.",
                        "ORDER_EVENTS_CHRONOLOGICALLY"),
                new Shard(4, "Shard-4: The Activist's Choice",
                        "Student groups joined the ___ boycott to put pressure on companies investing in apartheid.\n" +
                                "Protests, marches, and boycotts were all ways of showing ___ with South Africa.",
                        Map.of(1, List.of("Barclays", "Lloyds"),
                                2, List.of("solidarity", "opposition")),
                        "You took action. So did thousands of real students across the UK. " +
                                "Their pressure worked - Barclays eventually pulled out of South Africa in 1986. " +
                                "A global movement was forming, one choice at a time",
                        "DECISION_TREE"),
                new Shard(5, "Shard-5: Penton Street Office Map",
                        "The ANC set up its London office at 28 ___ Street.\n" +
                                "The building was used to store secret ___ and coordinate ___.",
                        Map.of(1, List.of("Penton", "Kenton"),
                                2, List.of("documents", "newsletters"),
                                3, List.of("protests", "meetings")),
                        "\u201cThe building was small, but its voice was loud. Stories, testimonies, and strategy " +
                                "passed through its walls every day. It was a hub for communication networks.\u201d",
                        "COMMUNICATION_NETWORK"),
                new Shard(6, "Shard-6: Bombing Puzzle",
                        "On 14th March 1982, apartheid agents planted a bomb at ___ Penton Street, hoping t" +
                                " assassinate ANC leader ___.\n" +
                                "Miraculously, no one was ___.",
                        Map.of(1, List.of("28", "26"),
                                2, List.of("Oliver Tambo", "Nelson Mandela"),
                                3, List.of("killed", "survived")),
                        "\u201cThe bomb shattered windows - but not the movement. The building stood. The work continued.\u201d",
                        "CONNECT_MATCHING"),
                new Shard(7, "Shard-7: The Sanctions Decision Board",
                        "People around the world called for ___ to put pressure on the South African government.\n" +
                                "In the UK, the government ___ support full sanctions — so ordinary people took the lead.\n" +
                                "Activists organised ___ of South African goods and sports teams.\n" +
                                "Local councils refused to invest their pension funds in ___ South Africa.",
                        Map.of(1, List.of("sanctions", "trade"),
                                2, List.of("did not", "did"),
                                3, List.of("boycotts", "freedom"),
                                4, List.of("apartheid", "support")),
                        "\u201cEconomic and cultural pressure sent a message: apartheid had no future.\u201d",
                        "DRAG_AND_CATEGORISE"),
                new Shard(8, "Shard-8: Songs of Resistance",
                        "Music carried messages of ___, even when speaking freely was banned.\n" +
                                "Struggle songs helped keep people ___.\n" +
                                "\"Free Nelson Mandela\" became an international ___.\n" +
                                "Music crossed ___ that people couldn't.",
                        Map.of(1, List.of("hope", "silence", "fear"),
                                2, List.of("united", "divided"),
                                3, List.of("anthem", "poster")),
                        "\u201cThese songs carried courage through communities - and across the world. They inspired " +
                                "people to get involved in the struggle for freedom and gave strength to those who kept resisting.\u201d",
                        "AUDIO_MATCHING_PUZZLE"),
                new Shard(9, "Shard-9: The Freedom Charter Signature",
                        "In ___, people from across South Africa came together to imagine a fair and equal country.\n" +
                                "They called their ideas the ___ Charter.\n" +
                                "The Charter said South Africa belongs to ___ who live in it.\n" +
                                "When apartheid ended, the Charter's principles helped shape South Africa's new ___.",
                        Map.of(1, List.of("1955", "1948"),
                                2, List.of("Freedom", "Apartheid"),
                                3, List.of("all", "some"),
                                4, List.of("Constitution", "Declaration")),
                        "\u201cThese words were once banned - but they survived. The Freedom Charter inspired" +
                                " generations of activists and helped shape South Africa's new Constitution, turning " +
                                "hope into law.\u201d",
                        "INK_DROP_REVEAL")
        ));
        System.out.println("Shards seeded.");
    }
}
