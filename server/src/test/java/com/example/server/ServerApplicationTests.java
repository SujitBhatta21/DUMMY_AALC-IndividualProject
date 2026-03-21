package com.example.server;

import org.junit.platform.suite.api.SelectPackages;
import org.junit.platform.suite.api.Suite;
import org.springframework.boot.test.context.SpringBootTest;


@SpringBootTest
@Suite
@SelectPackages("com.example.server")
class ServerApplicationTests {
    // Running this file with correct environment variable configuration
    // automatically calls all test files inside controller, repository and service directory.
}
