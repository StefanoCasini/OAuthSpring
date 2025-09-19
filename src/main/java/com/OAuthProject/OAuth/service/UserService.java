package com.OAuthProject.OAuth.service;

import com.OAuthProject.OAuth.model.User;
import com.OAuthProject.OAuth.repository.UserRepository;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Transactional
    public User saveOrUpdate(OAuth2User oAuth2User) {
        String email = oAuth2User.getAttribute("email");
        User user = userRepository.findByEmail(email);
        if (user == null) {
            user = new User();
            user.setEmail(email);
        }
        user.setName(oAuth2User.getAttribute("name"));
        user.setPicture(oAuth2User.getAttribute("picture"));
        return userRepository.save(user);
    }
}