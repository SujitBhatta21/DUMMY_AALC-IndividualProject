package com.example.server.service;

import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;

// There is no UserShardProgressService — the controller (UserShardProgressController)
// calls the repositories directly. 
// If a service layer is added in future, unit tests go here following the same
// @Mock / @InjectMocks pattern used in UserServiceTest and ReportServiceTest.

@ExtendWith(MockitoExtension.class)
public class UserShardProgressServiceTest {
}