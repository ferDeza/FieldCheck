package com.app.fieldcheck.repositories;
import com.app.fieldcheck.models.SportField;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface SportFieldRepository extends JpaRepository<SportField, Long> {
    List<SportField> findByType(String type);
}
