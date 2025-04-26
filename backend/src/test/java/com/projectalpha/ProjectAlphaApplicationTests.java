/*package com.projectalpha;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class ProjectAlphaApplicationTests {

	@Test
	void contextLoads() {
	}

}*/
package com.projectalpha;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Bean;
import org.springframework.boot.test.context.TestConfiguration;
import org.mockito.Mockito;
import com.projectalpha.service.UserService;

@SpringBootTest
class ProjectAlphaApplicationTests {

	@TestConfiguration
	static class MockConfig {

		@Bean
		public UserService userService() {
			return Mockito.mock(UserService.class);
		}
	}

	@Test
	void contextLoads() {
		// Context başarılı şekilde yükleniyor mu test edilir
	}
}
