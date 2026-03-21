package com.example.server.service;

import com.example.server.model.User;
import com.example.server.repository.ReportRepository;
import com.example.server.repository.UserRepository;
import com.example.server.repository.UserShardProgressRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;


@ExtendWith(MockitoExtension.class)
public class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private UserShardProgressRepository userShardProgressRepository;

    @Mock
    private ReportRepository reportRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserService userService;

    
    // validating password

    @Test
    public void validatePassword_throwsIfTooShort() {
        assertThatThrownBy(() -> userService.validatePassword("Ab1"))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("at least 8 characters");
    }

    @Test
    public void validatePassword_throwsIfTooLong() {
        // 17 characters — over the 16-char limit
        assertThatThrownBy(() -> userService.validatePassword("Abcdefghijk12345"))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("not exceed 16 characters");
    }

    @Test
    public void validatePassword_throwsIfNoUppercase() {
        assertThatThrownBy(() -> userService.validatePassword("password1"))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("uppercase");
    }

    @Test
    public void validatePassword_throwsIfNoNumber() {
        assertThatThrownBy(() -> userService.validatePassword("Passworddd"))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("number");
    }

    @Test
    public void validatePassword_passesForValidPassword() {
        // Should not throw — exactly 8 chars, has uppercase and a number.
        userService.validatePassword("Password1");
    }

    
    // registering

    @Test
    public void register_throwsIfUsernameTaken() {
        when(userRepository.existsByUsername("TakenUser")).thenReturn(true);

        User user = new User("Password1");
        user.setUsername("TakenUser");

        assertThatThrownBy(() -> userService.register(user))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("already taken");
    }

    @Test
    public void register_savesUserWithHashedPassword() {
        when(userRepository.existsByUsername("NewUser")).thenReturn(false);
        when(passwordEncoder.encode("Password1")).thenReturn("hashed");

        User user = new User("Password1");
        user.setUsername("NewUser");
        when(userRepository.save(any(User.class))).thenReturn(user);

        userService.register(user);

        // Password should be replaced with the hashed version before saving.
        verify(passwordEncoder).encode("Password1");
        verify(userRepository).save(user);
        assertThat(user.getPassword()).isEqualTo("hashed");
    }

    // login

    @Test
    public void login_throwsIfUserNotFound() {
        when(userRepository.findByUsername("ghost")).thenReturn(null);

        assertThatThrownBy(() -> userService.login("ghost", "Password1"))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Invalid username or password");
    }

    @Test
    public void login_throwsIfWrongPassword() {
        User user = new User("hashed");
        user.setUsername("Alice");
        when(userRepository.findByUsername("Alice")).thenReturn(user);
        when(passwordEncoder.matches("wrongpass", "hashed")).thenReturn(false);

        assertThatThrownBy(() -> userService.login("Alice", "wrongpass"))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Invalid username or password");
    }

    @Test
    public void login_returnsUserOnSuccess() {
        User user = new User("hashed");
        user.setUsername("Alice");
        when(userRepository.findByUsername("Alice")).thenReturn(user);
        when(passwordEncoder.matches("Password1", "hashed")).thenReturn(true);

        User result = userService.login("Alice", "Password1");

        assertThat(result.getUsername()).isEqualTo("Alice");
    }

    
    // checkCorrectOldPassword 

    @Test
    public void checkCorrectOldPassword_returnsTrueIfMatch() {
        User user = new User("hashed");
        user.setUserId(1);
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("Password1", "hashed")).thenReturn(true);

        assertThat(userService.checkCorrectOldPassword(1, "Password1")).isTrue();
    }

    @Test
    public void checkCorrectOldPassword_returnsFalseIfNoMatch() {
        User user = new User("hashed");
        user.setUserId(1);
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("WrongPass1", "hashed")).thenReturn(false);

        assertThat(userService.checkCorrectOldPassword(1, "WrongPass1")).isFalse();
    }

    @Test
    public void checkCorrectOldPassword_throwsIfUserNotFound() {
        when(userRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> userService.checkCorrectOldPassword(99, "Password1"))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("User not found");
    }

    
    // changePassword

    @Test
    public void changePassword_updatesPasswordSuccessfully() {
        User user = new User("oldHashed");
        user.setUserId(1);
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(passwordEncoder.encode("NewPass1")).thenReturn("newHashed");

        userService.changePassword(1, "NewPass1");

        verify(userRepository).save(user);
        assertThat(user.getPassword()).isEqualTo("newHashed");
    }

    @Test
    public void changePassword_throwsIfNewPasswordInvalid() {
        User user = new User("oldHashed");
        user.setUserId(1);
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));

        // "weak" has no uppercase and is too short — validatePassword should throw.
        assertThatThrownBy(() -> userService.changePassword(1, "weak"))
                .isInstanceOf(IllegalArgumentException.class);
    }

    @Test
    public void changePassword_throwsIfUserNotFound() {
        when(userRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> userService.changePassword(99, "NewPass1"))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("User not found");
    }
}