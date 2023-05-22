import org.jetbrains.kotlin.gradle.tasks.KotlinCompile

plugins {
	id("org.springframework.boot") version "3.0.4"
	id("io.spring.dependency-management") version "1.1.0"
	kotlin("jvm") version "1.7.22"
	kotlin("plugin.spring") version "1.7.22"
	kotlin("plugin.jpa") version "1.7.22"
}

group = "trombitasp"
version = "0.0.1-SNAPSHOT"
java.sourceCompatibility = JavaVersion.VERSION_17

repositories {
	mavenCentral()
}

dependencies {
	implementation("org.springframework.boot:spring-boot-starter-actuator")
	implementation("org.springframework.boot:spring-boot-starter-data-jpa")
	implementation("org.springframework.boot:spring-boot-starter-data-rest")
	implementation("org.springframework.boot:spring-boot-starter-security")
	implementation("org.springframework.boot:spring-boot-starter-validation")
	implementation("org.springframework.boot:spring-boot-starter-web")
	implementation("com.fasterxml.jackson.module:jackson-module-kotlin")
	implementation("org.jetbrains.kotlin:kotlin-reflect")
	implementation("io.jsonwebtoken:jjwt:0.9.1")
	//implementation("jakarta.xml.bind:jakarta.xml.bind-api:2.3.2")
	//implementation("jakarta.xml.bind:jakarta.xml.bind-api:4.0.0")
	//implementation("org.glassfish.jaxb:jaxb-runtime:4.0.2")
	//implementation("com.sun.xml.bind:jaxb-impl:4.0.2")
	implementation("com.sun.xml.bind:jaxb-core:2.3.0.1")
	implementation("javax.xml.bind:jaxb-api:2.3.1")
	implementation("com.sun.xml.bind:jaxb-impl:2.3.1")
	implementation("org.javassist:javassist:3.25.0-GA")

	//runtimeOnly("com.h2database:h2")
	runtimeOnly("mysql:mysql-connector-java:8.0.32")
	developmentOnly("org.springframework.boot:spring-boot-devtools")
	testImplementation("org.springframework.boot:spring-boot-starter-test")
	testImplementation("org.springframework.security:spring-security-test")
}

tasks.withType<KotlinCompile> {
	kotlinOptions {
		freeCompilerArgs = listOf("-Xjsr305=strict")
		jvmTarget = "17"
	}
}

tasks.withType<Test> {
	useJUnitPlatform()
}
